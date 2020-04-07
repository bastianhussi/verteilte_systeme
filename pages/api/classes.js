import { validateBody, auth, handleError } from '../../utils/apiValidation';
import { find, insertOne } from '../../utils/database';

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.status(405).end();
        break;
    }
  } catch (err) {
    handleError(req, res, err);
  }
}

async function handleGet(req, res) {
  auth(req);
  const { name, limit = 50 } = validateBody(req.query, {
    name: {
      required: false,
      type: 'string',
    },
    limit: {
      required: false,
      type: 'string',
      min: 1,
      max: 100,
    },
  });

  let cursor;
  if (name) {
    cursor = await find('rooms', { name }, parseInt(limit));
  } else {
    cursor = await find('classes', {}, parseInt(limit));
  }
  const classes = await cursor.toArray();
  res.status(200).json(classes);
}

async function handlePost(req, res) {
  auth(req);
  const doc = validateBody(req.body, {
    name: {
      required: true,
      type: 'string',
      min: 3,
      max: 30,
    },
  });
  const result = await insertOne('classes', doc);
  const newClass = { ...doc, _id: result.insertedId };
  res.status(201).json(newClass);
}
