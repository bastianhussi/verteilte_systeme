import Joi from '@hapi/joi';
import { find, insertOne, findOne } from '../../utils/database';
import {
    auth,
    handleError,
    validateData,
    authAdmin,
} from '../../utils/middleware';
import { BadRequestError } from '../../utils/errors';

async function handleGet(req, res) {
    auth(req);

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).optional(),
        start: Joi.date().iso().optional(),
        end: Joi.date().iso().greater(Joi.ref('start')).optional(),
        limit: Joi.number().integer().min(1).max(100).optional().default(50),
    });
    const { limit, ...query } = await validateData(req.query, schema);
    const cursor = await find('semesters', query, limit);
    const semesters = await cursor.toArray();
    res.status(200).json(semesters);
}

async function handlePost(req, res) {
    await authAdmin(req);

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        start: Joi.date().iso().required(),
        end: Joi.date().iso().greater(Joi.ref('start')).required(),
    });
    const doc = await validateData(req.body, schema);

    try {
        const conflict = await findOne('semesters', {
            $and: [{ start: { $lte: doc.end } }, { end: { $gte: doc.start } }],
        });
        throw new BadRequestError(
            `${doc.name} conflicts with ${conflict.name}`
        );
    } catch (err) {
        if (err instanceof BadRequestError) throw err;
    }

    const _id = await insertOne('semesters', doc);
    res.status(201).json({ ...doc, _id });
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
                break;
        }
    } catch (err) {
        handleError(res, err);
    }
}
