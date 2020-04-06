import { ObjectId } from 'mongodb';
import { findOne, updateOne, deleteOne } from '../../../utils/database';
import { auth, handleError, validateBody } from '../../../utils/apiValidation';

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
    auth(req);
    const { query: { id } } = req;

    // TODO: handle malformed ObjectId Error
    const room = await findOne('rooms', { _id: new ObjectId(id) });
    res.status(200).json(room);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function handlePATCH(req, res) {
  try {
    auth(req);
    const room = validateBody(req.body, {
      name: {
        required: true,
        type: 'string',
        min: '3',
        max: '20',
      },
    });
    const { query: { id } } = req;
    await updateOne('rooms', { _id: new ObjectId(id) }, { $set: room });
    const updatedRoom = await findOne('rooms', { _id: new ObjectId(id) });
    res.status(200).json(updatedRoom);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function handleDELETE(req, res) {
  try {
    auth(req);
    const { query: { id } } = req;
    await deleteOne('rooms', { _id: new ObjectId(id) });
    res.status(200);
  } catch (err) {
    handleError(req, res, err);
  }
}
