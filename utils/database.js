import { MongoClient } from 'mongodb';
import { NotFoundError, DatabaseError } from './errors';

const client = new MongoClient(process.env.MONGO_HOST || 'mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const DB = process.env.MONGO_DB || 'nextjs';

export async function insertOne(collection, doc) {
  const connection = await client.connect();
  const result = await connection.db(DB).collection(collection).insertOne(doc);
  if (result.insertedCount !== 1) throw new DatabaseError(`could not insert ${JSON.stringify(doc)}`, { collection, doc });
  await client.close();
  return result.insertedId;
}

export async function findOne(collection, filter) {
  const connection = await client.connect();
  const result = await connection.db(DB).collection(collection).findOne(filter);
  if (!result) throw new NotFoundError(`no results searching for ${JSON.stringify(filter)}`, { collection, query: filter });
  await client.close();
  return result;
}

// TODO: handle closing client
export async function find(collection, query, limit = Number.MAX_SAFE_INTEGER) {
  const connection = await client.connect();
  const cursor = await connection.db(DB).collection(collection).find(query).limit(limit);
  if (!await cursor.hasNext()) {
    throw new NotFoundError(`no results searching for ${JSON.stringify(query)}`, {
      collection,
      query,
      limit,
    });
  }
  // await client.close();
  return cursor;
}

export async function deleteOne(collection, filter) {
  console.log(filter)
  const connection = await client.connect();
  const result = await connection.db(DB).collection(collection).deleteOne(filter);
  if (result.deletedCount === 0) {
    throw new DatabaseError(`could not delete ${JSON.stringify(filter)}`, {
      collection,
      filter,
    });
  }
  await client.close();
}

export async function deleteMany(collection, filter) {
  const connection = await client.connect();
  const result = await connection.db(DB).collection(collection).deleteMany(filter);
  if (result.deletedCount === 0) {
    throw new DatabaseError(`could not delete ${JSON.stringify(filter)}`, {
      collection,
      filter,
    });
  }
  await client.close();
  return result;
}

// TODO: 
export async function updateOne(collection, filter, update) {
  const connection = await client.connect();
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
  await client.close();
}

// TODO: updateOne with upsert: true
