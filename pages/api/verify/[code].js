import { handleError } from '../../../utils/middleware';
import { updateOne, findOne } from '../../../utils/database';

async function handlePost(req, res) {
  const { code } = req.query;
  await updateOne('users', { code }, { $unset: { code } });
  res.status(200).end();
}

export default async function (req, res) {
  try {
    switch (req.method) {
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
