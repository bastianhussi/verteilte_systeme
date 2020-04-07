import { ObjectId } from 'mongodb';
import { findOne } from '../../../utils/database';
import { auth, handleError, validateBody } from '../../../utils/apiValidation';
import { ForbiddenError } from '../../../utils/errors';

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
  if (token._id !== id) {
    throw new ForbiddenError(`invalid token for the user with the id ${id}`, {
      reqBody: req.body,
      token,
      user,
    });
  }
  res.status(200).json(user);
}

async function handlePatch(req, res) {

}

async function handleDelete(req, res) {

}
