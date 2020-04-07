import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findOne } from '../../utils/database';
import { handleError, validateBody } from '../../utils/apiValidation';
import { UnauthorizedError } from '../../utils/errors';

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await handlePOST(req, res);
      default:
        res.status(405).end();
    }
  } catch (err) {
    handleError(req, res, err);
  }
}

async function handlePOST(req, res) {
  const { email, password } = validateBody(req.body, {
    email: {
      type: 'string',
      required: true,
      min: 5,
      max: 30,
    },
    password: {
      type: 'string',
      required: true,
    },
  });

  const user = await findOne('users', { email });
  if (!await bcrypt.compare(password, user.password)) {
    throw new UnauthorizedError('you entered a wrong password', { reqBody: req.body, plain: password, encrypted: user.password });
  }
  // token witch expires in 12 hours
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.status(201).json({ token });
}
