import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Sends a email the the user containing his verification code.
 * This function requires the entire url to activate the users accout.
 * @param {string} email - The users email address.
 * @param {string} urlWithCode - The url that will activate the account.
 */
export async function sendVerificationMail(email, urlWithCode) {
    const message = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Please activate your account',
        html: `<p>http://localhost:3000/verify/${code}</p>`,
    };
    await transport.sendMail(message);
}
