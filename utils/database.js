import { MongoClient } from 'mongodb';
import { NotFoundError, DatabaseError } from './errors';

const client = new MongoClient(process.env.MONGO_HOST || 'mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let connection;

async function getConnection() {
  if (!connection) {
    connection = await client.connect();
  }
  return connection;
}

const DB = process.env.MONGO_DB || 'nextjs';

export async function insertOne(collection, doc) {
  const connection = await getConnection();
  const result = await connection.db(DB).collection(collection).insertOne(doc);
  if (result.insertedCount !== 1) throw new DatabaseError(`could not insert ${JSON.stringify(doc)}`, { collection, doc });
  return result.insertedId;
}

export async function findOne(collection, filter) {
  const connection = await getConnection();
  const result = await connection.db(DB).collection(collection).findOne(filter);
  if (!result) throw new NotFoundError(`no results searching for ${JSON.stringify(filter)}`, { collection, query: filter });
  return result;
}

export async function find(collection, query, limit = Number.MAX_SAFE_INTEGER) {
  const connection = await getConnection();
  const cursor = connection.db(DB).collection(collection).find(query).limit(limit);
  if (!await cursor.hasNext()) {
    throw new NotFoundError(`no results searching for ${JSON.stringify(query)}`, {
      collection,
      query,
      limit,
    });
  }
  return cursor;
}

export async function deleteOne(collection, filter) {
  console.log(filter);
  const connection = await getConnection();
  const result = await connection.db(DB).collection(collection).deleteOne(filter);
  if (result.deletedCount === 0) {
    throw new DatabaseError(`could not delete ${JSON.stringify(filter)}`, {
      collection,
      filter,
    });
  }
}

export async function deleteMany(collection, filter) {
  const connection = await getConnection();
  const result = await connection.db(DB).collection(collection).deleteMany(filter);
  if (result.deletedCount === 0) {
    throw new DatabaseError(`could not delete ${JSON.stringify(filter)}`, {
      collection,
      filter,
    });
  }
  return result;
}

export async function updateOne(collection, filter, update) {
  const connection = await getConnection();
  const result = await connection.db(DB).collection(collection).updateOne(filter, update);
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

// TODO: updateOne with upsert: true
