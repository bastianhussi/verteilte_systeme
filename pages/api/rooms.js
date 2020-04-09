import Joi from '@hapi/joi';
import { find, insertOne } from '../../utils/database';
import { auth, handleError, validateData } from '../../utils/middleware';

/**
 * Searches the database for rooms and returns the ones
 * which match the given query.
 * The rooms name and a limit of rooms can be specified.
 * Requires a authorization header.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
  auth(req);

  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .optional(),
    limit: Joi.number().integer().min(1).max(100)
      .optional()
      .default(50),
  });
  const { limit, ...query } = await validateData(req.query, schema);

  const cursor = await find('rooms', query, limit);
  const rooms = await cursor.toArray();
  res.status(200).json(rooms);
}

/**
 * Creates a new room.
 * The requst body must have a name attribute.
 * Requires a authorization header.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePost(req, res) {
  auth(req);

  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .required(),
  });
  const room = await validateData(req.body, schema);

  const _id = await insertOne('rooms', room);
  res.status(201).json({ ...room, _id });
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
    handleError(req, res, err);
  }
}
