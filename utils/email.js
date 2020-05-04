import nodemailer from 'nodemailer';

// configurates nodemails with the credentials provided in the .env-file
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
 * @param {Object} user - The new user.
 * @param {string} link - The url that will activate the account.
 */
export default async function sendVerificationMail(user, link) {
    const message = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Please activate your account',
        html: `
        <body>
            <h1>Congratulations!🎉</h1>
            <p>You almost made it ${user.name}! Now just click the link below and activate your account.</p>
            <a href=${link}>verify account</a>
        </body>
        `,
    };
    await transport.sendMail(message);
}
