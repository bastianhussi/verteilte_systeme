import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { find, insertOne } from '../../utils/database';
import { validateBody, handleError, auth } from '../../utils/apiValidation';

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
  const { email = '', name = '', limit = 50 } = validateBody(req.query, {
    email: {
      required: false,
      type: 'string',
      min: 5,
      max: 40,
    },
    name: {
      required: false,
      type: 'string',
      min: 3,
      max: 50,
    },
  });
  const cursor = await find('users', { email, name }, limit);
  const users = await cursor.toArray();
  res.status(200).json(users);
}

async function handlePost(req, res) {
  const newUser = validateBody(req.body, {
    email: {
      required: true,
      type: 'string',
      min: 5,
      max: 40,
    },
    name: {
      required: true,
      type: 'string',
      min: 3,
      max: 50,
    },
    password: {
      required: true,
      type: 'string',
      min: 3,
      max: 30,
    },
  });

  // 10 rounds will be ok
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await insertOne('users', { ...newUser, password: hashedPassword });

  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.status(201).json({ token });
}
