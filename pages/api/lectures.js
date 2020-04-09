import Joi from '@hapi/joi';
import {
  handleError, validateData, auth, createObjectId,
} from '../../utils/middleware';
import { insertOne, find, findOne } from '../../utils/database';

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
  const token = auth(req);

  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(30)
      .optional(),
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

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePost(req, res) {
  const token = auth(req);

  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(30)
      .required(),
    class: Joi.string().required(),
    room: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
  });

  const doc = await validateData(req.body, schema);
  const userId = await Promise.all([
    findOne('users', { _id: createObjectId(token._id) }),
    findOne('classes', { _id: createObjectId(doc.class) }),
    findOne('rooms', { _id: createObjectId(doc.room) }),
  ])[0];

  const newLecture = { ...doc, user: userId };
  const _id = await insertOne('lectures', newLecture);

  res.status(201).json({ _id, ...newLecture });
}

/**
 * Top layer of this route.
 * Will check the request method and if the method is supported
 * the matching function is called.
 * Any errors that occurre will be handled by the handleError function from util/middleware.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
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
