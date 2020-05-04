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

/**
 * Searches the database for a semester with the given id.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
    auth(req);
    const { id } = req.query;
    const room = await findOne('rooms', { _id: createObjectId(id) });
    res.status(200).json(room);
}

/**
 * Changes a room.
 * The only possible attribute is the name of the room.
 * This route may only be called by an admin.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePatch(req, res) {
    await authAdmin(req);

    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(30).optional(),
    });
    const room = await validateData(req.body, schema);

    const _id = createObjectId(req.query.id);
    await updateOne('rooms', { _id }, { $set: room });
    const updatedRoom = await findOne('rooms', { _id });
    res.status(200).json(updatedRoom);
}

/**
 * Deletes a room.
 * Will throw an error if lectures in this room exist.
 * This route may only be called by an admin.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleDelete(req, res) {
    await authAdmin(req);

    const _id = createObjectId(req.query.id);

    try {
        const lecture = await findOne('lectures', { room: _id });
        throw new BadRequestError(
            'there are lectures using this room',
            lecture
        );
    } catch (err) {
        if (!err instanceof NotFoundError) throw err;
    }

    const deletedRoom = await findOne('rooms', { _id });
    await deleteOne('rooms', { _id });

    res.status(200).json(deletedRoom);
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
