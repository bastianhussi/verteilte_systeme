import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { findOne, updateOne, deleteOne } from '../../../utils/database';
import { auth, handleError, validateData } from '../../../utils/middleware';
import { ForbiddenError } from '../../../utils/errors';
import Joi from '@hapi/joi';

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

async function handleGet(req, res) {
  const token = auth(req);
  const { id } = req.query;

  const user = await findOne('users', ({ _id: new ObjectId(id) }));
  validateIdAgainstToken(token, id);
  res.status(200).json(user);
}

async function handlePatch(req, res) {
  const token = auth(req);

  const schema = Joi.object({
    email: Joi.string().email().trim().optional(),
    name: Joi.string().trim().min(3).max(50).optional(),
    password: Joi.string().min(3).max(50).optional()
  })
  const modifiedUser = await validateData(req.body, schema);

  const { id } = req.query;
  validateIdAgainstToken(token, id);

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
  validateIdAgainstToken(token, id);

  const deletedUser = await findOne('users', { _id: new ObjectId(id) });
  await deleteOne('users', { _id: new ObjectId(id) });
  
  deletedUser.remove(password);
  res.status(200).json(deletedUser);
}

function validateIdAgainstToken(token, id) {
  if (token._id !== id) {
    throw new ForbiddenError(`invalid token for the user with the id ${id}`, {
      reqBody: req.body,
      token,
      user,
    });
  }
}
