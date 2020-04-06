import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_HOST | 'mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection;

export default async function connect() {
  if(connection) {
    return connection.db('nextjs');
  } else {
    connection = await client.connect().db('nextjs');
    return connection;
  }
}