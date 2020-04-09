const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const client = new MongoClient(process.env.MONGO_HOST || 'mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbName = process.env.MONGO_DB || 'nextjs';

async function createAdminIfNotExits() {
  if (!await client.db(dbName).collection('users').findOne({ email: process.env.ADMIN_EMAIL })) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await client.db(dbName).collection('users').insertOne({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      admin: true,
    });
  }
}

async function createCollectionIfNotExists(collection) {
  const cursor = client.db(dbName).listCollections({ name: collection });
  if (!await cursor.hasNext()) {
    await client.db(dbName).createCollection(collection);
  }
}

async function createUniqueIndexIfNotExists(collection, field) {
  const cursor = client.db(dbName).collection(collection).listIndexes();
  const indexes = await cursor.toArray();
  const results = indexes.filter((index) => {
    index.key[field];
  });
  if (results.length === 0) {
    await client.db(dbName).collection(collection).createIndex(field, { unique: true });
  }
}

async function setup() {
  await client.connect();
  await Promise.all([
    createAdminIfNotExits(),
    createCollectionIfNotExists('rooms'),
    createCollectionIfNotExists('classes'),
    createCollectionIfNotExists('lectures'),
  ]);
  await Promise.all([
    createUniqueIndexIfNotExists('users', 'email'),
    createUniqueIndexIfNotExists('classes', 'name'),
    createUniqueIndexIfNotExists('rooms', 'name'),
  ]);
  await client.close();
}

module.exports = setup;
