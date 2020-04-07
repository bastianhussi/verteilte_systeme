import { ObjectId } from 'mongodb';
import { findOne, updateOne, deleteOne } from '../../../utils/database';
import { auth, handleError, validateBody } from '../../../utils/apiValidation';

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

async function handleGet(req, res) {
  try {
    auth(req);
    const { id } = req.query;
    const room = await findOne('rooms', { _id: new ObjectId(id) });
    res.status(200).json(room);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function handlePatch(req, res) {
  auth(req);
  const room = validateBody(req.body, {
    name: {
      required: true,
      type: 'string',
      min: 3,
      max: 20,
    },
  });
  const { id } = req.query;
  await updateOne('rooms', { _id: new ObjectId(id) }, { $set: room });
  const updatedRoom = await findOne('rooms', { _id: new ObjectId(id) });
  res.status(200).json(updatedRoom);
}

async function handleDelete(req, res) {
  auth(req);
  const { query: { id } } = req;
  await deleteOne('rooms', { _id: new ObjectId(id) });
  res.status(200).end();
}
