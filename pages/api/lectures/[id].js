import Joi from '@hapi/joi';
import {
    handleError,
    auth,
    validateIdAgainstToken,
    validateData,
    createObjectId,
} from '../../../utils/middleware';
import { findOne, updateOne, deleteOne } from '../../../utils/database';
import { BadRequestError } from '../../../utils/errors';

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
    const token = auth(req);
    const _id = createObjectId(req.query.id);

    const lecture = await findOne('lectures', { _id });

    validateIdAgainstToken(lecture.user, token);

    res.status(200).json(lecture);
}

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePatch(req, res) {
    const token = auth(req);
    const _id = createObjectId(req.query.id);

    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(30).optional(),
        course: Joi.string().optional(),
        room: Joi.string().optional(),
        start: Joi.date().optional(),
        end: Joi.date().optional(),
    });
    const doc = await validateData(req.body, schema);

    const lecture = await findOne('lectures', { _id });
    validateIdAgainstToken(lecture.user, token);

    if (doc.start || doc.end) {
        // check, if other lectures exist and if so check for conflicts.
        try {
            // get all lectures with the same user, course, or room.
            const conflict = await findOne('lectures', {
                $and: [
                    { _id: { $ne: createObjectId()}},
                    {
                        $or: [
                            { user: token._id },
                            { course: doc.course || lecture.course },
                            { room: doc.room || lecture.course },
                        ],
                    },
                    {
                        $and: [
                            { start: { $lte: doc.end || lecture.end } },
                            { end: { $gte: doc.start || lecture.start } },
                        ],
                    },
                ],
            });
            throw new BadRequestError(
                `${doc.title || lecture.title} conflicts with ${
                    conflict.title
                }`,
                { doc, conflict }
            );
        } catch (err) {
            // ignore NotFoundErros
            if (err instanceof BadRequestError) throw err;
        }
    }

    await updateOne('lectures', { _id }, { $set: doc });
    const updatedLecture = await findOne('lectures', { _id });
    res.status(200).json(updatedLecture);
}

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleDelete(req, res) {
    const token = auth(req);
    const _id = createObjectId(req.query.id);

    const lecture = await findOne('lectures', { _id });
    validateIdAgainstToken(lecture.user, token);

    await deleteOne('lectures', { _id });

    res.status(200).json(lecture);
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
            case 'PATCH':
                await handlePatch(req, res);
                break;
            case 'DELETE':
                await handleDelete(req, res);
                break;
            default:
                res.status(405).end();
                break;
        }
    } catch (err) {
        handleError(res, err);
    }
}
