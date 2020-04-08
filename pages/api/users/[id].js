import bcrypt from 'bcrypt';
import Joi from '@hapi/joi';
import { findOne, updateOne, deleteOne, find } from '../../../utils/database';
import { auth, handleError, validateData, validateIdAgainstToken, createObjectId } from '../../../utils/middleware';

async function handleGet(req, res) {
  const token = auth(req);
  const { id } = req.query;

  validateIdAgainstToken(id, token);

  const _id = createObjectId(id);
  const user = await findOne('users', ({ _id }));
  res.status(200).json(user);
}

async function handlePatch(req, res) {
  const token = auth(req);

  const schema = Joi.object({
    email: Joi.string().email().trim().optional(),
    name: Joi.string().trim().min(3).max(50)
      .optional(),
    password: Joi.string().min(3).max(50).optional(),
  });
  const modifiedUser = await validateData(req.body, schema);

  const { id } = req.query;
  validateIdAgainstToken(id, token);

  if (modifiedUser.password) {
    modifiedUser.password = await bcrypt.hash(modifiedUser.password, 10);
  }

  const _id = createObjectId(id);
  await updateOne('users', { _id }, { $set: modifiedUser });
  const updatedUser = await findOne('users', { _id });
  res.status(200).json(updatedUser);
}

async function handleDelete(req, res) {
  const token = auth(req);
  const { id } = req.query;
  validateIdAgainstToken(id, token);

  const _id = createObjectId(id);
  const deletedUser = await findOne('users', { _id });
  await deleteOne('users', { _id });

  deletedUser.remove(password);
  res.status(200).json(deletedUser);
}

export default async (req, res) => {
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
};
