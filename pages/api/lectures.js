import Joi from '@hapi/joi';
import { handleError, validateData, auth, createObjectId } from '../../utils/middleware';
import { insertOne, find, findOne } from '../../utils/database';

async function handleGet(req, res) {
  const token = auth(req);

  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(30).optional(),
    class: Joi.string().optional(),
    room: Joi.string().optional(),
    start: Joi.date().optional(),
    end: Joi.date().optional(),
    limit: Joi.number().integer().min(1).max(100)
      .optional()
      .default(50),
  });
  const { limit, ...query } = await validateData(req.query, schema);

  const cursor = await find('lectures', { user: token._id, ...query }, limit);
  const lectures = await cursor.toArray();
  res.status(200).json(lectures);
}

async function handlePost(req, res) {
  auth(req);

  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(30)
      .required(),
    user: Joi.string().required(),
    class: Joi.string().required(),
    room: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
  });
  const lecture = await validateData(req.body, schema);
  await Promise.all([
    findOne('users', { _id: createObjectId(lecture.user) }),
    findOne('classes', { _id: createObjectId(lecture.class) }),
    findOne('rooms', { _id: createObjectId(lecture.room) })
  ]);

  const _id = await insertOne('lectures', lecture);

  res.status(201).json({ _id, ...lecture });
}

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.status(405).end();
    }
  } catch (err) {
    handleError(req, res, err);
  }
}
