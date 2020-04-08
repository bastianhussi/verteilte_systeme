import crypto from 'crypto';
import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import { handleError, validateData } from '../../utils/middleware';
import { sendVerificationMail } from '../../utils/email';
import { insertOne } from '../../utils/database';

async function handlePost(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    name: Joi.string().trim().min(3).max(50)
      .required(),
    password: Joi.string().min(3).max(50).required(),
  });
  const newUser = await validateData(req.body, schema);

  // 10 rounds will be ok
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  const code = crypto.randomBytes(20).toString('hex');
  await insertOne('users', { code, ...newUser, password: hashedPassword });
  await sendVerificationMail(newUser.email, code);

  res.status(201).end();
}

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.status(405).end();
        break;
    }
  } catch (err) {
    handleError(req, res, err);
  }
}
