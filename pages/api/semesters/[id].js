import Joi from '@hapi/joi';
import { findOne, updateOne, deleteOne, find } from '../../../utils/database';
import {
    auth,
    handleError,
    validateData,
    createObjectId,
    authAdmin,
} from '../../../utils/middleware';
import { BadRequestError } from '../../../utils/errors';

async function handleGet(req, res) {
    auth(req);
    const { id } = req.query;
    const semester = await findOne('semesters', { _id: createObjectId(id) });
    res.status(200).json(semester);
}

async function handlePatch(req, res) {
    await authAdmin(req);
    const _id = createObjectId(req.query.id);

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).optional(),
        start: Joi.date().iso().optional(),
        end: Joi.date().iso().optional(),
    });
    const doc = await validateData(req.body, schema);

    // all get attributes from this semester
    const [name, start, end] = await (async function () {
        if (doc.name && doc.start && doc.end) {
            return [doc.name, doc.start, doc.end];
        } else {
            const { name, start, end } = await findOne('semesters', {
                _id,
            });
            return [doc.name || name, doc.start || start, doc.end || end];
        }
    })();

    if (new Date(start).getTime() >= new Date(end).getTime())
        throw new BadRequestError('"end" must be greater than "start"', {
            doc,
            start,
            end,
        });

    if (doc.start || doc.end) {
        try {
            const conflict = await findOne('semesters', {
                $and: [
                    { _id: { $ne: _id } },
                    {
                        $and: [
                            { start: { $lte: end } },
                            { end: { $gte: start } },
                        ],
                    },
                ],
            });
            throw new BadRequestError(
                `${name} conflicts with ${
                    conflict.name
                } on ${conflict.start.toDateString()}`
            );
        } catch (err) {
            if (err instanceof BadRequestError) throw err;
        }
    }

    await updateOne('semesters', { _id }, { $set: doc });
    const updatedSemester = await findOne('semesters', { _id });
    res.status(200).json(updatedSemester);
}

async function handleDelete(req, res) {
    await authAdmin(req);

    const _id = createObjectId(req.query.id);
    const deletedSemester = await findOne('semesters', { _id });

    try {
        const lecture = await findOne('lectures', {
            semester: deletedSemester.semester,
        });
        throw new BadRequestError(
            'there are lectures in this semester',
            lecture
        );
    } catch (err) {
        if (err instanceof BadRequestError) throw err;
    }

    await deleteOne('semesters', { _id });
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
