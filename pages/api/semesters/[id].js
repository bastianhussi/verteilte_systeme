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

/**
 * Searches the database for a semester with the given id.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
    auth(req);
    const { id } = req.query;
    const semester = await findOne('semesters', { _id: createObjectId(id) });
    res.status(200).json(semester);
}

/**
 * Changes a existing semester.
 * Attributes that may be changed are the name, start- and end-date.
 * This route may only be called by an admin.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePatch(req, res) {
    await authAdmin(req);
    const _id = createObjectId(req.query.id);

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).optional(),
        start: Joi.date().iso().optional(),
        end: Joi.date().iso().optional(),
    });
    const doc = await validateData(req.body, schema);

    // all get attributes from this semester, even the ones that have not changed.
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

    // throw an error if the start date after the end date.
    if (new Date(start).getTime() >= new Date(end).getTime())
        throw new BadRequestError('"end" must be greater than "start"', {
            doc,
            start,
            end,
        });

    // check for conflicts if start- or end-date have changed
    if (doc.start || doc.end) {
        try {
            // query the database for all other semesters that conflict with this one.
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

/**
 * Deletes a semester.
 * Throws an error if lectures in this semester exist.
 * This route may only be called by an admin.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleDelete(req, res) {
    await authAdmin(req);

    const _id = createObjectId(req.query.id);

    try {
        const lecture = await findOne('lectures', {
            semester: _id,
        });
        throw new BadRequestError(
            `${lecture.name} exists for this semester`,
            lecture
        );
    } catch (err) {
        if (err instanceof BadRequestError) throw err;
    }

    const deletedSemester = await findOne('semesters', { _id });
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
