const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const client = new MongoClient(
    process.env.MONGO_HOST || 'mongodb://localhost:27017',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const dbName = process.env.MONGO_DB || 'nextjs';

async function createAdminIfNotExits() {
    const admin = {
        email: process.env.ADMIN_EMAIL,
        name: process.env.ADMIN_NAME || 'root',
        password: process.env.ADMIN_PASSWORD,
        admin: true,
    };
    if (
        !(await client
            .db(dbName)
            .collection('users')
            .findOne({ email: admin.email }))
    ) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await client
            .db(dbName)
            .collection('users')
            .insertOne({ ...admin, password: hashedPassword });
        console.log(`created admin ${admin.name}, with email ${admin.email}`);
    }
}

async function createCollectionIfNotExists(collection) {
    const cursor = client.db(dbName).listCollections({ name: collection });
    if (!(await cursor.hasNext())) {
        await client.db(dbName).createCollection(collection);
        console.log(`created collection ${collection}`);
    }
}

async function createUniqueIndexIfNotExists(collection, field, name) {
    if (!(await client.db(dbName).collection(collection).indexExists(name))) {
        await client
            .db(dbName)
            .collection(collection)
            .createIndex(field, { unique: true, name });
        console.log(
            `created index ${name} on collection ${collection}, field ${field}`
        );
    }
}

async function setup() {
    await client.connect();
    await Promise.all([
        createAdminIfNotExits(),
        createCollectionIfNotExists('rooms'),
        createCollectionIfNotExists('courses'),
        createCollectionIfNotExists('lectures'),
        createCollectionIfNotExists('semesters'),
    ]);
    await Promise.all([
        createUniqueIndexIfNotExists('users', 'email', 'users_email'),
        createUniqueIndexIfNotExists('courses', 'name', 'courses_name'),
        createUniqueIndexIfNotExists('rooms', 'name', 'rooms_name'),
        createUniqueIndexIfNotExists('semesters', 'name', 'semesters_name'),
        createUniqueIndexIfNotExists('semesters', 'start', 'semesters_start'),
        createUniqueIndexIfNotExists('semesters', 'end', 'semesters_end'),
    ]);
    await client.close();
}

module.exports = setup;
