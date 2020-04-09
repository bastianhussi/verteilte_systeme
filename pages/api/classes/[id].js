import Joi from '@hapi/joi';
import {
  findOne, find, deleteOne, updateOne,
} from '../../../utils/database';
import {
  validateData, handleError, auth, createObjectId, authAdmin,
} from '../../../utils/middleware';
import { BadRequestError } from '../../../utils/errors';

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
  auth(req);
  const { id } = req.query;
  const foundClass = await findOne('classes', { _id: createObjectId(id) });
  res.status(200).json(foundClass);
}

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePatch(req, res) {
  await authAdmin(req);

  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .optional()
      .default(''),
  });
  const modifiedClass = await validateData(req.body, schema);

  const { id } = req.query;
  await updateOne('classes', { _id: createObjectId(id) }, { $set: modifiedClass });
  const updatedClass = await findOne('classes', { _id: createObjectId(id) });
  res.status(200).json(updatedClass);
}

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleDelete(req, res) {
  await authAdmin(req);
  const { id } = req.query;

  const lecture = await findOne('lectures', { room: _id });
  if (lecture) {
    throw new BadRequestError('there are lectures for this class', lecture);
  }

  const deletedClass = await findOne('classes', { _id: createObjectId(id) });
  await deleteOne('classes', { _id: createObjectId(id) });

  res.status(200).json(deletedClass);
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
    handleError(res, err);
  }
}
