import Joi from '@hapi/joi';
import { findOne, deleteOne, updateOne } from '../../../utils/database';
import {
    validateData,
    handleError,
    auth,
    createObjectId,
    authAdmin,
} from '../../../utils/middleware';
import { BadRequestError, NotFoundError } from '../../../utils/errors';

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
    auth(req);
    const { id } = req.query;
    const course = await findOne('courses', { _id: createObjectId(id) });
    res.status(200).json(course);
}

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePatch(req, res) {
    await authAdmin(req);

    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(30).optional().default(''),
    });
    const modifiedCourse = await validateData(req.body, schema);

    const { id } = req.query;
    await updateOne(
        'courses',
        { _id: createObjectId(id) },
        { $set: modifiedCourse }
    );
    const updatedCourse = await findOne('courses', { _id: createObjectId(id) });
    res.status(200).json(updatedCourse);
}

/**
 *
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleDelete(req, res) {
    await authAdmin(req);
    const { id } = req.query;

    let lecture;
    try {
        lecture = await findOne('lectures', { room: createObjectId(id) });
    } catch (err) {
        // NotFoundErros should make this fail
        if (!err instanceof NotFoundError) throw err;
    }

    if (lecture) {
        throw new BadRequestError('there are lectures for this class', lecture);
    }

    const deletedCourse = await findOne('courses', { _id: createObjectId(id) });
    await deleteOne('courses', { _id: createObjectId(id) });

    res.status(200).json(deletedCourse);
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
