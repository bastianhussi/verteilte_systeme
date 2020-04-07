import jwt from 'jsonwebtoken';
import { UserFacingError, BadRequestError, UnauthorizedError } from './errors';

// checks if the token in the authorization header is valid.
export function auth(req) {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) throw new UnauthorizedError('missing authorization header', { token, req });

  // in case of Bearer token
  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) throw new UnauthorizedError('unvalid jwt token', { err, token, req });
    return decoded;
  });
}

export function handleError(req, res, err) {
  if (err instanceof UserFacingError) {
    console.log(err.message)
    res.status(err.statusCode).send(err.message);
  } else {
    res.status(500).end();
    console.error(err, 'request body:', req.body, 'request query', req.query);
  }
}

export async function validateData(data, schema) {
  try {
    return await schema.validateAsync(data);
  } catch (err) {
    throw new BadRequestError(err.details.message, { data, schema, err });
  }
}