import Joi from '@hapi/joi';
import { find, insertOne } from '../../utils/database';
import { auth, handleError, validateData } from '../../utils/middleware';

// example for possible querystrings: /api/rooms?name=201A&limit=200;
async function handleGET(req, res) {
  auth(req);

  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .optional(),
    limit: Joi.number().integer().min(1).max(100)
      .default(50),
  });
  const { limit, ...query } = await validateData(req.query, schema);

  const cursor = await find('rooms', query, parseInt(limit));
  const rooms = await cursor.toArray();
  res.status(200).json(rooms);
}

async function handlePOST(req, res) {
  auth(req);

  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .required(),
  });
  const room = await validateData(req.body, schema);

  const roomId = await insertOne('rooms', room);
  res.status(201).json({ ...room, _id: roomId });
}

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGET(req, res);
        break;
      case 'POST':
        await handlePOST(req, res);
        break;
      default:
        res.status(405).end();
        break;
    }
  } catch (err) {
    handleError(req, res, err);
  }
}
