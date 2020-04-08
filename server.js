(async function setup() {
    const { MongoClient } = require('mongodb');
    const bcrypt = require('bcrypt');

    const client = new MongoClient(process.env.MONGO_HOST || 'mongodb://localhost:27017', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await client.connect();

    const DB = process.env.MONGO_DB || 'nextjs';
    const email = process.env.ADMIN_EMAIL;

    // create admin account if not exits
    const admin = await client.db(DB).collection('users').findOne({ email });
    if (!admin) {
        const password = process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.db(DB).collection('users').insertOne({ email, name: 'root', password: hashedPassword, admin: true });
        console.log(`Created admin with email: ${email} and password: ${password}`);
    }

    // create index on users email if not exits
    const index = await client.db(DB).collection('users').indexExists('email');
    if(!index) {
        await client.db(DB).collection('users').createIndex('email');
        console.log('Created index on users email');
    }

    await client.close();
})();

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


// see: https://nextjs.org/docs/advanced-features/custom-server
app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        if (pathname === '/a') {
            app.render(req, res, '/b', query);
        } else if (pathname === '/b') {
            app.render(req, res, '/a', query);
        } else {
            handle(req, res, parsedUrl)
        }

    }).listen(3000, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000');
    });
});
