import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import database from '../../../utils/database';

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

function getToken(req, res) {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) return res.status(401);
  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  const { query: { id } } = req;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // TODO: change order! first get user (check for 404), then compare token._id with id from req

    if (decoded._id !== id) return res.status(403).send('invalid jwt for this user account');
    return decoded;
  } catch (err) {
    return res.status(401).send('invalid jwt');
  }
}

async function handleGET(req, res) {
  const token = getToken(req, res);
  const client = database();

  try {
    await client.connect();
    const user = await client.db('nextjs').collection('users').findOne({ _id: new ObjectId(token._id) });
    if (!user) return res.status(404).send(`no user with the id ${token._id} found!`);
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`an error occured: ${err}`);
  } finally {
    await client.close();
  }
}

async function handlePATCH(req, res) {

}

async function handleDELETE(req, res) {

}
