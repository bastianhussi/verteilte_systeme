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
    const user = await database().collection('users').findOne({ email: req.body.email });
    if (!user) return res.status(404).send(`found no user with the email address: ${req.body.email}`);
    if (!await bcrypt.compare(req.body.password, user.password)) return res.status(401).send('you entered a wrong password');

    // token witch expires in 12 hours
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: req.body.email,
        password: req.body.password,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`an error occured: ${err}`);
  }
}
