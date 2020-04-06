import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import database from '../../utils/database';

export default async (req, res) => {
  switch (req.method) {
    case 'POST':
      await handlePOST(req, res);
    default:
      res.status(405);
  }
};

async function handlePOST(req, res) {
  try {
    // 10 saltRounds will be ok
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await database().collection('users').insertOne({
      email: req.body.email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user.insertedId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      token,
      user: {
        _id: user.insertedId,
        email: req.body.email,
        password: req.body.password,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`an error occured: ${err}`);
  }
}
