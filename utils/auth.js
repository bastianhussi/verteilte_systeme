import Router from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// all cookies are saved in one string and seperated by "; "
function getCookieByName(cookieName, { req }) {
  // check if on server or client
  let cookies;
  if (req) {
    if (!req.headers.cookie) return null;
    cookies = req.headers.cookie.split('; ');
  } else {
    if (document.cookie === '') return null;
    cookies = document.cookie.split('; ');
  }

  const cookie = cookies.filter((c) => c.startsWith(cookieName))[0];
  if (cookie) {
    return cookie.split('=')[1];
  }
  return null;
}

function reject(ctx, path) {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: path });
    ctx.res.end();
  } else {
    Router.push(path);
  }
}

export function login(token) {
  const now = new Date();
  // expires in 12 hours
  now.setHours(now.getHours + 12);
  document.cookie = `token=${token}; expires=${now.toUTCString()}; path=/`;
  Router.push('/');
}

export function logout() {
  // expires now
  document.cookie = `token=; expires=${new Date().toUTCString()}; path=/`;
  Router.push('/login');
}

/*
 * Checks if the user has a token.
 * Use only for checking the access to webpages.
 */
export async function auth(ctx) {
  const token = getCookieByName('token', ctx);

  if (!token) {
    reject(ctx, '/login');
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const res =  await axios.get(`http://localhost:3000/api/users/${decoded._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.data;
  } catch {
    reject(ctx, '/login');
  }
}

/*
 * Checks if the user is logged in.
 * Use only for validating access to a webpage.
 */
export function noAuth(ctx) {
  const token = getCookieByName('token', ctx);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) reject(ctx, '/');
    });
  }
}
