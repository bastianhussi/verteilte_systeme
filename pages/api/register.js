import crypto from 'crypto';
import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import { handleError, validateData } from '../../utils/middleware';
import { sendVerificationMail } from '../../utils/email';
import { insertOne } from '../../utils/database';

/**
 * Will create a new user and send an verification code to this email address.
 * The request body requires an email, name and password.
 * The password will be hashed with bcrypt and then stored in the database
 * along with all the user data of the user.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePost(req, res) {
    const schema = Joi.object({
        email: Joi.string().email().trim().required(),
        name: Joi.string().trim().min(3).max(50).required(),
        password: Joi.string().min(3).max(50).required(),
    });
    const newUser = await validateData(req.body, schema);

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const salt = crypto.randomBytes(128).toString('base64');
    const code = crypto
        .pbkdf2Sync(newUser.email, salt, 10, 32, 'sha256')
        .toString('hex');

    await insertOne('users', {
        code,
        ...newUser,
        password: hashedPassword,
        courses: [],
    });
    await sendVerificationMail(newUser.email, code);

    res.status(201).end();
}

/**
 * Creates a new room.
 * The requst body must have a name attribute.
 * Requires a authorization header.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
export default async function (req, res) {
    try {
        switch (req.method) {
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
