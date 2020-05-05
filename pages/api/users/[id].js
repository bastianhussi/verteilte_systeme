import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Joi from '@hapi/joi';
import {
    findOne,
    updateOne,
    deleteOne,
    deleteMany,
} from '../../../utils/database';
import {
    auth,
    handleError,
    validateData,
    validateIdAgainstToken,
    createObjectId,
} from '../../../utils/middleware';
import sendVerificationMail from '../../../utils/email';
import { NotFoundError, BadRequestError } from '../../../utils/errors';

/**
 * Returns the user with the specified id.
 * This route may only be called from the user, that ownes this account.
 * Full information (including password) is send back if the validation was successfull.
 * This way the user can see and change his account information in the app.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleGet(req, res) {
    const token = auth(req);
    const { id } = req.query;

    validateIdAgainstToken(id, token);

    const _id = createObjectId(id);
    const user = await findOne('users', { _id });

    // removing password, although they are hashed
    delete user.password;
    res.status(200).json(user);
}

/**
 * Change attribute(s) of the users account.
 * This route may only be called from the user, that ownes this account.
 * Possible attributes are email, name of password.
 * The code has to be changed at api/verify/[code] and the admin attribute
 * cannot be changed/deleted.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePatch(req, res) {
    const token = auth(req);

    const schema = Joi.object({
        email: Joi.string().email().trim().optional(),
        name: Joi.string().trim().min(3).max(50).optional(),
        newPassword: Joi.string().min(3).max(50).optional(),
        oldPassword: Joi.string()
            .min(3)
            .max(50)
            .optional()
            .when('newPassword', { then: Joi.not(Joi.ref('newPassword')) }),
    });
    const modifiedUser = await validateData(req.body, schema);

    const { id } = req.query;
    validateIdAgainstToken(id, token);

    const _id = createObjectId(id);

    if (modifiedUser.newPassword) {
        const { password } = await findOne('users', { _id });

        // check if the old password is correct
        if (!(await bcrypt.compare(modifiedUser.oldPassword, password))) {
            throw new BadRequestError('old password is wrong', {
                modifiedUser,
                password,
            });
        }

        // hash the password, if it gets changed.
        modifiedUser.password = await bcrypt.hash(
            modifiedUser.newPassword,
            10);

        delete modifiedUser.newPassword;
        delete modifiedUser.oldPassword;
    }

    await updateOne('users', { _id }, { $set: modifiedUser });
    const updatedUser = await findOne('users', { _id });

    // if the email address gets changed a new code has to be generated
    // and the new email address has to be verified.
    if (modifiedUser.email) {
        const salt = crypto.randomBytes(128).toString('base64');
        const code = crypto
            .pbkdf2Sync(modifiedUser.email, salt, 10, 32, 'sha256')
            .toString('hex');

        // adding a code attribute to the user document and sending a verification email.
        // This happens asyncroniously to speed things up.
        await Promise.all([
            updateOne(
                'users',
                { _id },
                { $set: Object.assign(modifiedUser, { code }) }
            ),
            sendVerificationMail(
                updatedUser,
                `${req.headers.origin}/verify/${code}`
            ),
        ]);
    }

    res.status(200).json(updatedUser);
}

/**
 * Deletes a user account.
 * This route may only be called from the user, that ownes this account.
 * Will also delete all lectures held by the user.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handleDelete(req, res) {
    const token = auth(req);
    const { id } = req.query;
    validateIdAgainstToken(id, token);

    const _id = createObjectId(id);
    const deletedUser = await findOne('users', { _id });
    await deleteOne('users', { _id });

    try {
        await deleteMany('lectures', { user: _id });
    } catch (err) {
        // NotFoundErros shouldn't make this request fail
        if (!err instanceof NotFoundError) throw err;
    }

    res.status(200).json(deletedUser);
}

/**
 * Top layer of this route.
 * Will check the request method and if the method is supported
 * the matching function is called.
 * Any errors that occurre will be handled by the handleError function from util/middleware.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
export default async (req, res) => {
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
};
