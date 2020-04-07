import { handleError, validateData, auth } from '../../utils/middleware';
import Joi from '@hapi/joi';
import { insertOne, find } from '../../utils/database';

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
        handleError(req, res, err);
    }
}

async function handleGet(req, res) {
    auth(req);

    const schema = Joi.object({
        title: Joi.string().trim().optional().default(''),
        classId: Joi.string().optional().default(''),
        roomId: Joi.string().optional().default(''),
        limit: Joi.number().integer().min(1).max(100).optional().default(50)
    });
    const { limit, ...query } = await validateData(req.body, schema);

    const cursor = await find('lectures', query, limit);
    const lectures = await cursor.toArray();
    res.status(200).json(lectures);
}

async function handlePost(req, res) {
    auth(req);

    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(30).required(),
        classId: Joi.string().required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
        roomId: Joi.string().required()
    });
    const newLecture = await validateData(req.body, schema);

    const lectureId = await insertOne('lectures', newLecture);
    res.status(201).json({ _id: lectureId, ...newLecture });
}