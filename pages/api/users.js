import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { find, insertOne } from '../../utils/database';
import { validateData, handleError, auth } from '../../utils/middleware';
import Joi from '@hapi/joi';

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
      case 'POST':
        await handlePost(req, res);
      default:
        res.status(405).end();
    }
  } catch (err) {
    handleError(req, res, err);
  }
}

async function handleGet(req, res) {
  auth(req);

  const schema = Joi.object({
    email: Joi.string().email().trim().optional(),
    name: Joi.string().trim().min(3).max(50).optional(),
    limit: Joi.number().integer().min(1).max(100).optional().default(50)
  })
  const { limit, ...query } = await validateData(req.query, schema);

  const cursor = await find('users', query, limit);
  const users = await cursor.toArray();
  res.status(200).json(users);
}

async function handlePost(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    name: Joi.string().trim().min(3).max(50).required(),
    password: Joi.string().min(3).max(50).required()
  })
  const newUser = await validateData(req.body, schema);


  // 10 rounds will be ok
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await insertOne('users', { password: hashedPassword, ...newUser });

  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.status(201).json({ token });
}
