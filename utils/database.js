import { MongoClient } from 'mongodb';
import { NotFoundError, DatabaseError } from './errors';

// The client that executes all the quires.
// In MongoDB it's best practice to keep a connection open during
// the whole time the server is running.
const client = new MongoClient(
    process.env.MONGO_HOST || 'mongodb://localhost:27017',
    {
        // options, that prevent deprecation warnings
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// connect to the database once.
client.connect().catch((err) => {
    console.error(err);
    process.exit(1);
});

// Will read the database name from the environment variables.
// If none exist 'nextjs' will be used.
const dbName = process.env.MONGO_DB || 'nextjs';

/**
 * Inserts the given document into a collection.
 * Will throw an DatabaseError if the document could not be inserted.
 * @param {string} collection - The collection for this data.
 * @param {object} doc - The document to insert.
 */
export async function insertOne(collection, doc) {
    const result = await client
        .db(dbName)
        .collection(collection)
        .insertOne(doc);
    if (result.insertedCount !== 1)
        throw new DatabaseError(`could not insert ${JSON.stringify(doc)}`, {
            collection,
            doc,
        });
    return result.insertedId;
}

/**
 * Searches the database for a document matching a filter.
 * Only returns one documents, even if multiple documents match the filter.
 * For finding multiple documents refer to the "findMany"-function below.
 * @param {string} collection - The collection for this data.
 * @param {object} filter
 */
export async function findOne(collection, filter) {
    const result = await client
        .db(dbName)
        .collection(collection)
        .findOne(filter);
    if (!result)
        throw new NotFoundError(
            `no results searching for ${JSON.stringify(filter)}`,
            { collection, query: filter }
        );
    return result;
}

/**
 * Searches the database for documents matching the query.
 * The limit specifies the amout of documents that will be returned.
 * If no limit is given the maximum number of documents will be returned.
 * For finding only one document refer to the "findOne"-function above.
 * @param {string} collection - The collection for this data.
 * @param {object} query
 * @param {number} limit
 */
export async function find(collection, query, limit = Number.MAX_SAFE_INTEGER) {
    const cursor = client
        .db(dbName)
        .collection(collection)
        .find(query)
        .limit(limit);
    if (!(await cursor.hasNext())) {
        throw new NotFoundError(
            `no results searching for ${JSON.stringify(query)}`,
            {
                collection,
                query,
                limit,
            }
        );
    }
    return cursor;
}

/**
 * Updates one document in a collection matching the filter.
 * The update attribute specifies the update to be executed on the found document.
 * Even if multiple documents match the filter only the first will be updated.
 * Filtering should only be done by a unique attribute of the document.
 * If no documents were found a NotFoundError will be thrown.
 * @param {*} collection - The collection for this data.
 * @param {*} filter
 * @param {*} update
 */
export async function updateOne(collection, filter, update) {
    const result = await client
        .db(dbName)
        .collection(collection)
        .updateOne(filter, update);
    if (result.matchedCount === 0) {
        throw new NotFoundError(
            `no results searching for ${JSON.stringify(filter)}`,
            {
                collection,
                filter,
                update,
            }
        );
    }
}

/**
 * Updates all documents matching the filter.
 * The update attribute specifies the update to be executed on the found documents.
 * @param {*} collection - The collection for this data.
 * @param {*} filter
 * @param {*} update
 */
export async function updateMany(collection, filter, update) {
    const result = await client
        .db(dbName)
        .collection(collection)
        .updateMany(filter, update);
    if (result.matchedCount === 0) {
        throw new NotFoundError(
            `no results searching for ${JSON.stringify(filter)}`,
            {
                collection,
                filter,
                update,
            }
        );
    }
}

/**
 * Deletes one document for the collection. This will be the first document matching the filter
 * If no document get deleted a NotFoundError will be thrown.
 * @param {*} collection - The collection for this data.
 * @param {*} filter
 */
export async function deleteOne(collection, filter) {
    const result = await client
        .db(dbName)
        .collection(collection)
        .deleteOne(filter);
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
 * @param {*} collection - The collection for this data.
 * @param {*} filter
 */
export async function deleteMany(collection, filter) {
    const result = await client
        .db(dbName)
        .collection(collection)
        .deleteMany(filter);
    if (result.deletedCount === 0) {
        throw new NotFoundError(`could not find ${JSON.stringify(filter)}`, {
            collection,
            filter,
        });
    }
    return result;
}
