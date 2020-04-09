import Joi from '@hapi/joi';
import {
  handleError, validateData, auth, createObjectId,
} from '../../utils/middleware';
import { insertOne, find, findOne } from '../../utils/database';
import { BadRequestError } from '../../utils/errors';

/**
 * Searches the database for lectures matching the query.
 * The query may include the tile, user, class, room, 
 * start date, end date and a limit of results.
 * The user, class and room attribute have to be the _id of
 * an existing user, class or room. 
 * Requires a authorization header.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
  auth(req);

  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(30)
      .optional(),
    user: Joi.string().optional(),
    class: Joi.string().optional(),
    room: Joi.string().optional(),
    start: Joi.date().optional(),
    end: Joi.date().optional(),
    limit: Joi.number().integer().min(1).max(100)
      .optional()
      .default(50),
  });
  const { limit, ...query } = await validateData(req.query, schema);

  const cursor = await find('lectures', query, limit);
  const lectures = await cursor.toArray();
  res.status(200).json(lectures);
}

/**
 * Creates a new lecture.
 * The request body must have a title-, class-, room-,
 * start- and end attribute. 
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePost(req, res) {
  const token = auth(req);

  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(30)
      .required(),
    class: Joi.string().required(),
    room: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
  });

  const doc = await validateData(req.body, schema);
  const user = await findOne('users', { _id: createObjectId(token._id) });
  await Promise.all([
    findOne('classes', { _id: createObjectId(doc.class) }),
    findOne('rooms', { _id: createObjectId(doc.room) }),
  ]);

  const cursor = await find('lectures', {
    $or: [
      { user: createObjectId(token._id) },
      { class: createObjectId(doc.class) },
      { room: createObjectId(doc.room) }
    ]
  });

  const otherLectures = await cursor.toArray();

  // checking for other lectures start and end conflicting with this new one.
  otherLectures.filter((otherLecture) => {
    (otherLecture.start <= doc.end) && (otherLecture.end >= doc.start);
  });

  if (otherLectures.length !== 0) {
    throw new BadRequestError(`this lectures conflicts with ${JSON.stringify(otherLectures)}`);
  }

  const newLecture = { ...doc, user: user._id };
  const _id = await insertOne('lectures', newLecture);

  res.status(201).json({ _id, ...newLecture });
}

/**
 * Top layer of this route.
 * Will check the request method and if the method is supported
 * the matching function is called.
 * Any errors that occurre will be handled by the handleError function from util/middleware.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
export default async function (req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.status(405).end();
    }
  } catch (err) {
    handleError(res, err);
  }
}
