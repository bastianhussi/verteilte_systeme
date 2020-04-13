import jwt from 'jsonwebtoken';
import { ObjectId, MongoError } from 'mongodb';
import ApplicationError, {
  UserFacingError, BadRequestError, UnauthorizedError, ForbiddenError,
} from './errors';
import { findOne } from './database';

/**
 * Checks the request header for a x-access-token or a Bearer token.
 * If one is found it will be verified and returned if valid.
 * If not a UnauthorizedError will be thrown.
 * @param {object} req - The incoming request.
 */
export function auth(req) {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) throw new UnauthorizedError('missing authorization header', { token, req });

  // in case of Bearer token
  if (token.startsWith('Bearer ')) {
    [, token] = token.split(' ');
  }

  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) throw new UnauthorizedError('unvalid jwt token', { err, token, req });
    return decoded;
  });
}

/**
 * Just like the auth-function above but on top this function
 * checks if the user is also an admin.
 * This function is usefull for making sure only admins can make certain http requests.
 * @param {object} req - The incoming request.
 */
export async function authAdmin(req) {
  const token = auth(req);
  const user = await findOne('users', { _id: createObjectId(token._id) });
  if (!user.admin) throw new ForbiddenError('this resource is only accessible for admins', { reqBody, reqQuery: req.query, user });
  return user;
}

/**
 * This function is used a top layer try/catch for every api route.
 * Will write the matching response for each error type.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 * @param {ApplicationError} err - The error that occurred.
 */
export function handleError(res, err) {
  if (err instanceof UserFacingError) {
    res.status(err.statusCode).send(err.message);
    if (process.env.NODE_ENV !== 'production') console.log(err);
  } else if (err instanceof MongoError) {
    switch (err.code) {
      case 11000:
        res.status(400).send(`duplicate entry for ${Object.entries(err.keyValue)}`);
        break;
      default:
        res.status(500).end();
        console.log(err);
        break;
    }
  } else {
    res.status(500).end();
    console.log(err);
  }
}

/**
 * Validates a object against a Joi object.
 * If the data is valid it will returned. (Parsing may happen.)
 * If the data is unvalid a BadRequestError is thrown
 * @param {object} data - Any object.
 * @param {object} schema - A matching Joi schema.
 */
export async function validateData(data, schema) {
  try {
    return await schema.validateAsync(data);
  } catch (err) {
    throw new BadRequestError(err.details[0].message, { data, schema, err });
  }
}

/**
 * Checks if the given id matches the jwt.
 * Used for checking if the user accessing data is the owner of this data.
 * @param {string} id - A MongoDB ObjectId as a string.
 * @param {object} token - The user's id stored in a jwt.
 */
export function validateIdAgainstToken(id, { _id }) {
  if (id !== _id) {
    throw new ForbiddenError(`invalid token for the user with the id ${id}`, {
      id,
      token: _id,
    });
  }
}

/**
 * Creates a new Object of the ObjectId class from the mongodb driver.
 * Should be used instead of new ObjectId, because this function will
 * produce a matching error, if no valid ObjectId is given.
 * @param {string} id - Any string.
 */
export function createObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (err) {
    throw new BadRequestError(err, { id });
  }
}
