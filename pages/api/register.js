import crypto from 'crypto';
import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import { handleError, validateData } from '../../utils/middleware';
import sendVerificationMail from '../../utils/email';
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

    // hash the given password
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    // generate a random code.
    // users with a code cannot log in. If the verify their account,
    // by clicking on the link in their confirmation email,
    // the code attribute in their account will be deleted.
    const salt = crypto.randomBytes(128).toString('base64');
    const code = crypto
        .pbkdf2Sync(newUser.email, salt, 10, 32, 'sha256')
        .toString('hex');

    // insertes the user into the database and sends the verification email.
    // This will happen asyncroniously to speed things up.
    await Promise.all([
        insertOne('users', {
            code,
            ...newUser,
            password: hashedPassword,
        }),
        sendVerificationMail(newUser, `${req.headers.origin}/verify/${code}`),
    ]);

    res.status(201).end();
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
