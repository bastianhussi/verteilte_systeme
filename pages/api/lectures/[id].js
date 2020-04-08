import { handleError, auth, validateIdAgainstToken, validateData, createObjectId } from "../../../utils/middleware";
import { findOne, updateOne, find, deleteOne } from "../../../utils/database";
import Joi from "@hapi/joi";

async function handleGet(req, res) {
    const token = auth(req);
    const _id = createObjectId(req.query.id);

    const lecture = await findOne('lectures', { _id });

    validateIdAgainstToken(lecture.user, token);

    res.status(200).json(lecture);
}

async function handlePatch(req, res) {
    const token = auth(req);

    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(30).optional(),
        class: Joi.string().optional(),
        room: Joi.string().optional(),
        start: Joi.date().optional(),
        end: Joi.date().optional()
    });

    const modifiedLecture = await validateData(req.body, schema);

    const _id = createObjectId(req.query);
    const { user } = await findOne('lectures', { _id });

    validateIdAgainstToken(user, token);

    await updateOne('lectures', { _id }, { $set: modifiedLecture });
    const updatedLecture = await findOne('lectures', { _id });

    res.status(200).json(updatedLecture);
}

async function handleDelete(req, res) {
    const token = auth(req);
    const _id = createObjectId(req.query.id);

    const lecture = await find('lectures', { _id });

    validateIdAgainstToken(lecture.user, token);

    await deleteOne('lectures', { _id });

    res.status(200).json(lecture);
}

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
        handleError(req, res, err);
    }
}
