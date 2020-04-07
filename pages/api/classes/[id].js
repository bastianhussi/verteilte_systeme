import { ObjectId } from 'mongodb';
import { findOne, deleteOne, updateOne } from '../../../utils/database';
import { validateData, handleError, auth } from '../../../utils/middleware';
import Joi from '@hapi/joi';

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

async function handleGet(req, res) {
    auth(req);
    const { id } = req.query;
    const foundClass = await findOne('classes', { _id: new ObjectId(id) });
    res.status(200).json(foundClass);
}

async function handlePatch(req, res) {
    auth(req);

    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(30).optional().default('')
    })
    const modifiedClass = await validateData(req.body, schema);

    const { id } = req.query;
    await updateOne('classes', { _id: new ObjectId(id) }, { $set: modifiedClass });
    const updatedClass = await findOne('classes', { _id: new ObjectId(id) });
    res.status(200).json(updatedClass);
}

async function handleDelete(req, res) {
    auth(req);
    const { id } = req.query;

    const deletedClass = await findOne('classes', { _id: new ObjectId(id) });
    await deleteOne('classes', { _id: new ObjectId(id) });

    res.status(200).json(deletedClass);
}
