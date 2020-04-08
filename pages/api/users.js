import Joi from '@hapi/joi';
import { find, findOne } from '../../utils/database';
import { validateData, handleError, auth, createObjectId } from '../../utils/middleware';
import { ForbiddenError } from '../../utils/errors';

async function handleGet(req, res) {
  const token = auth(req);

  const _id = createObjectId(token._id);
  // only admins should view other users data
  const requestUser = await findOne('users', { _id });
  if (!requestUser.admin) throw new ForbiddenError('only admins can access other users data!', { reqQuery: req.query, requestUser });

  const schema = Joi.object({
    email: Joi.string().email().trim().optional(),
    name: Joi.string().trim().min(3).max(50)
      .optional(),
    limit: Joi.number().integer().min(1).max(100)
      .optional()
      .default(50),
  });
  const { limit, ...query } = await validateData(req.query, schema);

  const cursor = await find('users', query, limit);
  const users = await cursor.toArray();
  
  // removing password, although they are hashed
  users.map(user => {
    delete user.password
  });
  res.status(200).json(users);
}

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
      default:
        res.status(405).end();
    }
  } catch (err) {
    handleError(req, res, err);
  }
}
