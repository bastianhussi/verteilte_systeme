import { MongoClient } from 'mongodb';
import { NotFoundError, DatabaseError } from './errors';

const client = new MongoClient(process.env.MONGO_HOST || 'mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * This function checks if the client inside the "client"-variable (see above)
 * has an active connection to the database.
 * If not a connection will be established.
 */
async function checkConnection() {
  if (!client.isConnected()) {
    await client.connect();
  }
}

const dbName = process.env.MONGO_DB || 'nextjs';

/**
 * Inserts the given document into a collection.
 * Will throw an DatabaseError if the document could not be inserted.
 * @param {string} collection
 * @param {object} doc
 */
export async function insertOne(collection, doc) {
  await checkConnection();
  const result = await client.db(dbName).collection(collection).insertOne(doc);
  if (result.insertedCount !== 1) throw new DatabaseError(`could not insert ${JSON.stringify(doc)}`, { collection, doc });
  return result.insertedId;
}

/**
 * Searches the database for a document matching a filter.
 * Only returns one documents, even if multiple documents match the filter.
 * For finding multiple documents refer to the "findMany"-function below.
 * @param {string} collection
 * @param {object} filter
 */
export async function findOne(collection, filter) {
  await checkConnection();
  const result = await client.db(dbName).collection(collection).findOne(filter);
  if (!result) throw new NotFoundError(`no results searching for ${JSON.stringify(filter)}`, { collection, query: filter });
  return result;
}

/**
 * Searches the database for documents matching the query.
 * The limit specifies the amout of documents that will be returned.
 * If no limit is given the maximum number of documents will be returned.
 * For finding only one document refer to the "findOne"-function above.
 * @param {string} collection
 * @param {object} query
 * @param {number} limit
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
 * Updates one document in a collection matching the filter.
 * The update attribute specifies the update to be executed on the found document.
 * Even if multiple documents match the filter only the first will be updated.
 * Filtering should only be done by a unique attribute of the document.
 * If no documents were found a NotFoundError will be thrown and
 * if none are getting updated a DatabaseError will be thrown.
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
}

/**
 * Deletes one document for the collection. This will be the first document matching the filter
 * If no document get deleted a NotFoundError will be thrown.
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
 * Deletes all documents from the collection matching the filter.
 * If no documents get deleted a NotFoundError will the thrown.
 * @param {*} collection
 * @param {*} filter
 */
export async function deleteMany(collection, filter) {
  await checkConnection();
  const result = await client.db(DB).collection(collection).deleteMany(filter);
  if (result.deletedCount === 0) {
    throw new NotFoundError(`could not find ${JSON.stringify(filter)}`, {
      collection,
      filter,
    });
  }
  return result;
}
