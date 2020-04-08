import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import Joi from '@hapi/joi';
import { findOne, updateOne, deleteOne } from '../../../utils/database';
import { auth, handleError, validateData, validateIdAgainstToken } from '../../../utils/middleware';

async function handleGet(req, res) {
  const token = auth(req);
  const { id } = req.query;

  const user = await findOne('users', ({ _id: new ObjectId(id) }));
  validateIdAgainstToken(id, token);
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

  await updateOne('users', { _id: new ObjectId(id) }, { $set: modifiedUser });
  const updatedUser = await findOne('users', { _id: new ObjectId(id) });
  res.status(200).json(updatedUser);
}

async function handleDelete(req, res) {
  const token = auth(req);
  const { id } = req.query;
  validateIdAgainstToken(id, token);

  const deletedUser = await findOne('users', { _id: new ObjectId(id) });
  await deleteOne('users', { _id: new ObjectId(id) });

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
