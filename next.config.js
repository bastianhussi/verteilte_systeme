require('dotenv').config();

module.exports = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
