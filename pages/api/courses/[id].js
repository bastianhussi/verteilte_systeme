import Joi from '@hapi/joi';
import { findOne, deleteOne, updateOne } from '../../../utils/database';
import {
    validateData,
    handleError,
    auth,
    createObjectId,
    authAdmin,
} from '../../../utils/middleware';
import { BadRequestError } from '../../../utils/errors';

/**
 * Searches the database for a course with the given id.
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
 * Changes a course.
 * Possible attributes are the name and the color (in hex-code, e.g. #9c93d6).
 * This route may only be called by an admin.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePatch(req, res) {
    await authAdmin(req);

    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(30).optional(),
        color: Joi.string()
            .trim()
            .regex(new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$'))
            .optional(),
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
 * Deletes a course.
 * Throws an error if lectures with the course exist.
 * This route may only be called by an admin.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleDelete(req, res) {
    await authAdmin(req);
    const { id } = req.query;

    try {
        const lecture = await findOne('lectures', {
            course: createObjectId(id),
        });
        throw new BadRequestError(
            `${lecture.name} exists for this course`,
            lecture
        );
    } catch (err) {
        // NotFoundErros should make this fail
        if (err instanceof BadRequestError) throw err;
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
