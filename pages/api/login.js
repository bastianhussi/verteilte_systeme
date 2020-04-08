import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import { findOne } from '../../utils/database';
import { handleError, validateData } from '../../utils/middleware';
import { UnauthorizedError } from '../../utils/errors';

async function handlePost(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(3).max(50).required(),
  });
  const { email, password } = await validateData(req.body, schema);

  const user = await findOne('users', { email });

  if (user.code) {
    throw new UnauthorizedError('please verify your email address', { reqBody: req.body, user }); 
  }
  if (!await bcrypt.compare(password, user.password)) {
    throw new UnauthorizedError('you entered a wrong password', { reqBody: req.body, plain: password, encrypted: user.password });
  }
  // token witch expires in 12 hours
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.status(201).json({ token });
}

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await handlePost(req, res);
      default:
        res.status(405).end();
    }
  } catch (err) {
    handleError(req, res, err);
  }
}
