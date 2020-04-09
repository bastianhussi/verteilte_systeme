import Joi from '@hapi/joi';
import { findOne, updateOne, deleteOne } from '../../../utils/database';
import {
  auth, handleError, validateData, createObjectId,
} from '../../../utils/middleware';

/**
 * Returns a room if one is found in the database.
 * Requires a authorization header.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
  try {
    auth(req);
    const _id = createObjectId(req.query.id);
    const room = await findOne('rooms', { _id });
    res.status(200).json(room);
  } catch (err) {
    handleError(req, res, err);
  }
}

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePatch(req, res) {
  auth(req);

  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .optional(),
  });
  const room = await validateData(req.body, schema);

  const _id = createObjectId(req.query.id);
  await updateOne('rooms', { _id }, { $set: room });
  const updatedRoom = await findOne('rooms', { _id });
  res.status(200).json(updatedRoom);
}

async function handleDelete(req, res) {
  auth(req);
  const _id = createObjectId(req.query.id);

  const deletedRoom = await findOne('rooms', { _id });
  await deleteOne('rooms', { _id });

  res.status(200).json(deletedRoom);
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
      case 'PATCH':
        await handlePatch(req, res);
        break;
      case 'DELETE':
        await handleDelete(req, res);
        break;
      default:
        res.status(405).end();
        break;
    }
  } catch (err) {
    handleError(req, res, err);
  }
}
