import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import { findOne } from '../../utils/database';
import { handleError, validateData } from '../../utils/middleware';
import { UnauthorizedError } from '../../utils/errors';

/**
 * Call this route to login in and recieve a jwt.
 * The request body requires the users email and password.
 * The password will be compared against the hashed password from the database.
 * If the user exists and the password is valid a jwt is returned,
 * which is valid for 12 hours.
 * @param {object} req - The incoming request.
 * @param {object} res - The outgoing response.
 */
async function handlePost(req, res) {
    const schema = Joi.object({
        email: Joi.string().email().trim().required(),
        password: Joi.string().min(3).max(50).required(),
    });
    const { email, password } = await validateData(req.body, schema);

    const user = await findOne('users', { email });

    if (user.code) {
        throw new UnauthorizedError('please verify your email address', {
            reqBody: req.body,
            user,
        });
    }
    if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedError('you entered a wrong password', {
            reqBody: req.body,
            plain: password,
            encrypted: user.password,
        });
    }
    // token witch expires in 12 hours
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '12h',
    });
    res.status(201).json({ token });
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
            default:
                res.status(405).end();
        }
    } catch (err) {
        handleError(res, err);
    }
}
