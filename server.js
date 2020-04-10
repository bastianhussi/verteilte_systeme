const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const setup = require('./setup');

setup().then(() => {
  // see: https://nextjs.org/docs/advanced-features/custom-server
  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/a') {
        app.render(req, res, '/b', query);
      } else if (pathname === '/b') {
        app.render(req, res, '/a', query);
      } else {
        handle(req, res, parsedUrl);
      }
    }).listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  });
}).catch((err) => {
  console.log(err);
  process.exit(1);
});
