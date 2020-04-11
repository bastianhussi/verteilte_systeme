import Joi from '@hapi/joi';
import {
  auth, handleError, validateData, authAdmin,
} from '../../utils/middleware';
import { find, insertOne } from '../../utils/database';

/**
 * Searches the database for courses matching the query.
 * The query can include the course name and a limit of results.
 * Requires a authorization header.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
  auth(req);

  const schema = Joi.object({
    name: Joi.string().trim().max(30).optional(),
    limit: Joi.number().integer().min(1).max(100)
      .optional()
      .default(50),
  });
  const { limit, ...query } = await validateData(req.query, schema);

  const cursor = await find('courses', query, limit);
  const courses = await cursor.toArray();
  res.status(200).json(courses);
}

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePost(req, res) {
  await authAdmin(req);

  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .required(),
  });
  const doc = await validateData(req.body, schema);

  const _id = await insertOne('courses', doc);
  res.status(201).json({ _id, ...doc });
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
        break;
    }
  } catch (err) {
    handleError(res, err);
  }
}
