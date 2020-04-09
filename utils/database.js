import { MongoClient } from 'mongodb';
import { NotFoundError, DatabaseError } from './errors';

const client = new MongoClient(process.env.MONGO_HOST || 'mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 *
 */
async function checkConnection() {
  if (!client.isConnected()) {
    await client.connect();
  }
}

const dbName = process.env.MONGO_DB || 'nextjs';

/**
 *
 * @param {*} collection
 * @param {*} doc
 */
export async function insertOne(collection, doc) {
  await checkConnection();
  const result = await client.db(dbName).collection(collection).insertOne(doc);
  if (result.insertedCount !== 1) throw new DatabaseError(`could not insert ${JSON.stringify(doc)}`, { collection, doc });
  return result.insertedId;
}

/**
 *
 * @param {*} collection
 * @param {*} filter
 */
export async function findOne(collection, filter) {
  await checkConnection();
  const result = await client.db(dbName).collection(collection).findOne(filter);
  if (!result) throw new NotFoundError(`no results searching for ${JSON.stringify(filter)}`, { collection, query: filter });
  return result;
}

/**
 *
 * @param {*} collection
 * @param {*} query
 * @param {*} limit
 */
export async function find(collection, query, limit = Number.MAX_SAFE_INTEGER) {
  await checkConnection();
  const cursor = client.db(dbName).collection(collection).find(query).limit(limit);
  if (!await cursor.hasNext()) {
    throw new NotFoundError(`no results searching for ${JSON.stringify(query)}`, {
      collection,
      query,
      limit,
    });
  }
  return cursor;
}

/**
 *
 * @param {*} collection
 * @param {*} filter
 */
export async function deleteOne(collection, filter) {
  await checkConnection();
  const result = await client.db(dbName).collection(collection).deleteOne(filter);
  if (result.deletedCount === 0) {
    throw new NotFoundError(`could not find ${JSON.stringify(filter)}`, {
      collection,
      filter,
    });
  }
}

/**
 *
 * @param {*} collection
 * @param {*} filter
 * @param {*} update
 */
export async function updateOne(collection, filter, update) {
  await checkConnection();
  const result = await client.db(dbName).collection(collection).updateOne(filter, update);
  if (result.matchedCount === 0) {
    throw new NotFoundError(`no results searching for ${JSON.stringify(filter)}`, {
      collection,
      filter,
      update,
    });
  }
  if (result.modifiedCount === 0) {
    throw new DatabaseError(`could not modify ${JSON.stringify(filter)}`, {
      collection,
      filter,
      update,
    });
  }
}
