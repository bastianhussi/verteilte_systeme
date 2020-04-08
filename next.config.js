require('dotenv').config();

module.exports = {
  // disable x-powered-by in request headers
  poweredByHeader: false,
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
