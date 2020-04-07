import { UserFacingError, BadRequestError, UnauthorizedError } from './errors';
import jwt from 'jsonwebtoken';

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
    return res.status(err.statusCode).send(err.message);
  } else {
    res.status(500).end();
    console.error(err, 'request body:', req.body, 'request query', req.query);
  }
}

// TODO: implement parsing

/*
 * Validates the body of a req against a given schema.
 * If a attribute of the body doesn't meet the requirements an ApplicationError is thrown.
 * This function ignores attributes which aren't speficied in the schema.
 * These attributes should be ignored in the API as well.
 *
 * Attributes that can be validated are: required, type, min and max.
 * - required: true or false
 * - type: 'string', 'boolean', 'number', ... (all values of typeof)
 * - min: number (only works with strings and arrays)
 * - max: number (only works with strings and arrays)
 * #############################
 * Example:
 * const schema = {
 *  email: {
 *      required: true,
 *      type: string,
 *      min: 5,
 *      max: 20
 *  },
 *  password: {
 *      required: true,
 *      type: 'string',
 *      min: 8
 *  },
 *  age: {
 *      required: false,
 *      type: 'number'
 *  }
 * }
 * #############################
 */
export function validateBody(body, schema) {
  for (const [requiredAttributes, rules] of Object.entries(schema)) {
    if (!body[requiredAttributes] && rules.required) {
      throw new BadRequestError(`${requiredAttributes} required`, {
        body,
        schema,
      });
    }
    for (const [ruleAttribute, ruleValue] of Object.entries(rules)) {
      // optional value, no need for validation
      if (ruleAttribute == 'required' && ruleValue == false) break;
      switch (ruleAttribute) {
        case 'type':
          if (typeof body[requiredAttributes] !== ruleValue) {
            throw new BadRequestError(`type of ${body[requiredAttributes]} needs to be ${ruleValue}. ${typeof body[requiredAttributes]} provided!`, { body, schema });
          }
          break;
        case 'min':
          if (typeof body[requiredAttributes] == 'number') {
            if (body[requiredAttributes] < ruleValue) {
              throw new BadRequestError(`min length of ${body[requiredAttributes]} needs to be ${ruleValue}. ${body[requiredAttributes].length} provided`, { body, schema });
            }
          } else
            if (body[requiredAttributes].length < ruleValue) {
              throw new BadRequestError(`min length of ${body[requiredAttributes]} needs to be ${ruleValue}. ${body[requiredAttributes].length} provided`, { body, schema });
            }
          break;
        case 'max':
          if (typeof body[requiredAttributes] == 'number') {
            if (body[requiredAttributes] > ruleValue) {
              throw new BadRequestError(`max length of ${body[requiredAttributes]} needs to be ${ruleValue}. ${body[requiredAttributes].length} provided`, { body, schema });
            }
          } else {
            if (body[requiredAttributes].length > ruleValue) {
              throw new BadRequestError(`max length of ${body[requiredAttributes]} needs to be ${ruleValue}. ${body[requiredAttributes].length} provided`, { body, schema });
            }
          }
          break;
        default:
          break;
      }
    }
  }
  return body;
}
