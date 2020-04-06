import { MongoClient } from 'mongodb';

export default function connect() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client;
}
