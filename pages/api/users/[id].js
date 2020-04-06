import { ObjectId } from 'mongodb';
import database from '../../../utils/database';
import { authAPI } from '../../../utils/auth';

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

// TODO: handle mongodb errors
async function handleGET(req, res) {
  const token = authAPI(req, res);
  const { query: { id } } = req;
  try {
    const db = await database();
    const user = await db.collection('users').findOne({ _id: new ObjectId(token._id) });
    if (!user) return res.status(404).send(`no user with the id ${token._id} found!`);
    if (token._id !== id) return res.status(403).send(`invalid token for the user with the id ${id}`);
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`an error occured: ${err}`);
  }
}

async function handlePATCH(req, res) {

}

async function handleDELETE(req, res) {

}
