import Joi from '@hapi/joi';
import {
    handleError,
    validateData,
    auth,
    createObjectId,
} from '../../utils/middleware';
import { insertOne, find, findOne } from '../../utils/database';
import { BadRequestError, NotFoundError } from '../../utils/errors';

/**
 * Searches the database for lectures matching the query.
 * This only returns lectures belonging to the user that
 * made this request.
 * Possible queries are a limit of results, the title, course, room, start-
 * and end time.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
    const token = auth(req);

    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(30).optional(),
        course: Joi.string().optional(),
        room: Joi.string().optional(),
        start: Joi.date().optional(),
        end: Joi.date().optional(),
        limit: Joi.number().integer().min(1).max(100).optional().default(50),
    });
    let { limit, ...query } = await validateData(req.query, schema);

    // parse the course- and room-id to ObjectId objects.
    if (query.course) query.course = createObjectId(query.course);
    if (query.room) query.room = createObjectId(query.room);

    const cursor = await find(
        'lectures',
        {
            user: createObjectId(token._id),
            ...query,
        },
        limit
    );
    const lectures = await cursor.toArray();
    res.status(200).json(lectures);
}

/**
 * Creates a new lecture.
 * The request body must have a title-, course-, room-,
 * start- and end attribute.
 * This new lecture cannot conflict with an existing lecture:
 * There can't be two lectures with the same user, or course, or room
 * at the same time.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePost(req, res) {
    const token = auth(req);

    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(30).required(),
        course: Joi.string().required(),
        room: Joi.string().required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
    });

    const doc = await validateData(req.body, schema);
    const user = await findOne('users', { _id: createObjectId(token._id) });
    await Promise.all([
        findOne('courses', { _id: createObjectId(doc.course) }),
        findOne('rooms', { _id: createObjectId(doc.room) }),
    ]);

    // check, if other lectures exist and if so check for conflicts.
    try {
        // get all lectures with the same user, course, or room.
        const cursor = await find('lectures', {
            $or: [
                { user: createObjectId(token._id) },
                { course: createObjectId(doc.course) },
                { room: createObjectId(doc.room) },
            ],
        });

        const otherLectures = await cursor.toArray();

        // search for lectures that conflict with the start and end time of this new one.
        otherLectures.filter((otherLecture) => {
            otherLecture.start <= doc.end && otherLecture.end >= doc.start;
        });

        if (otherLectures.length !== 0) {
            throw new BadRequestError(
                `this lectures conflicts with ${JSON.stringify(otherLectures)}`
            );
        }
    } catch (err) {
        // no other lectures isn't a problem
        if (!err instanceof NotFoundError) throw err;
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
