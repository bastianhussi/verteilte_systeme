import Joi from '@hapi/joi';
import { findOne, updateOne, deleteOne } from '../../../utils/database';
import {
    auth,
    handleError,
    validateData,
    createObjectId,
    authAdmin,
} from '../../../utils/middleware';
import { NotFoundError } from '../../../utils/errors';

async function handleGet(req, res) {
    auth(req);
    const { id } = req.query;
    const semester = await findOne('semesters', { _id: createObjectId(id) });
    res.status(200).json(semester);
}

async function handlePatch(req, res) {
    await authAdmin(req);

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).optional(),
        start: Joi.date().iso().optional(),
        end: Joi.date().iso().greater(Joi.ref('start')).optional(),
    });
    const semester = await validateData(req.body, schema);

    const _id = createObjectId(req.query.id);
    await updateOne('semesters', { _id }, { $set: semester });
    const updatedSemester = await findOne('semesters', { _id });
    res.status(200).json(updatedSemester);
}

async function handleDelete(req, res) {
    await authAdmin(req);

    const _id = createObjectId(req.query.id);
    const deletedSemester = await findOne('rooms', { _id });

    try {
        const lecture = await findOne('lectures', {
            $and: [
                { start: { $gt: deletedSemester.start } },
                { end: { $lt: deletedSemester.end } },
            ],
        });
        throw new BadRequestError(
            'there are lectures in this semester',
            lecture
        );
    } catch (err) {
        if (!err instanceof NotFoundError) throw err;
    }

    await deleteOne('rooms', { _id });
    res.status(200).json(deletedSemester);
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
