import Joi from '@hapi/joi';
import { auth, handleError, validateData } from '../../utils/middleware';
import { find, insertOne } from '../../utils/database';

async function handleGet(req, res) {
  auth(req);

  const schema = Joi.object({
    name: Joi.string().trim().max(30).optional(),
    limit: Joi.number().integer().min(1).max(100)
      .optional()
      .default(50),
  });
  const { limit, ...query } = await validateData(req.query, schema);

  const cursor = await find('classes', query, parseInt(limit));
  const classes = await cursor.toArray();
  res.status(200).json(classes);
}

async function handlePost(req, res) {
  auth(req);

  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .required(),
  });
  const doc = await validateData(req.body, schema);

  const classId = await insertOne('classes', doc);
  res.status(201).json({ _id: classId, ...doc });
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
        break;
    }
  } catch (err) {
    handleError(req, res, err);
  }
}
