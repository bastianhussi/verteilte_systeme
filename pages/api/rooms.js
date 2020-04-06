import { find, insertOne } from '../../utils/database';
import { auth, handleError, validateBody } from '../../utils/apiValidation';

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGET(req, res);
      break;
    case 'POST':
      await handlePOST(req, res);
      break;
    default:
      res.status(405);
      break;
  }
};

// example for possible querystrings: /api/rooms?name=201A&limit=200;
async function handleGET(req, res) {
  try {
    auth(req);
    const { name, limit = 100 } = validateBody(req.query, {
      name: {
        required: false,
        type: 'string',
        min: 3,
        max: 20
      },
      limit: {
        required: false,
        type: 'string',
        min: 1,
        max: 100
      }
    });
    // TODO: implement parsing in validateBody-function
    let cursor;
    console.log(name, limit)
    if (name) {
      cursor = await find('rooms', { name: name }, parseInt(limit));
    } else {
      cursor = await find('rooms', {}, parseInt(limit));
    }
    const rooms = await cursor.toArray();
    console.log(rooms);
    res.status(200).json(rooms);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function handlePOST(req, res) {
  try {
    auth(req);
    const room = validateBody(req.body, {
      name: {
        required: true, type: 'string', min: 3, max: 20,
      },
    });
    const roomId = await insertOne('rooms', room);
    res.status(201).json({ ...room, _id: roomId });
  } catch (err) {
    handleError(req, res, err);
  }
}
