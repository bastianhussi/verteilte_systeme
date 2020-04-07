import { ObjectId } from 'mongodb';
import { findOne } from '../../../utils/database';
import { auth, handleError, validateBody } from '../../../utils/apiValidation';
import { ForbiddenError } from '../../../utils/errors';

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGET(req, res);
      break;
    case 'PATCH':
      await handlePATCH(req, res);
      break;
    case 'DELETE':
      await handleDELETE(req, res);
      break;
    default:
      res.status(405);
      break;
  }
};

async function handleGET(req, res) {
  try {
    const token = auth(req);
    const { query: { id } } = req;

    // TODO: handle malformed ObjectId Error
    const user = await findOne('users', ({ _id: new ObjectId(id) }));
    if (token._id !== id) throw new ForbiddenError(`invalid token for the user with the id ${id}`, {
      reqBody: req.body,
      token,
      user
    });
    res.status(200).json(user);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function handlePATCH(req, res) {

}

async function handleDELETE(req, res) {

}
