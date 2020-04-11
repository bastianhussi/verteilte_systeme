import Router from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { UnauthorizedError } from './errors';

/**
 * 
 * @param {*} cookieName 
 * @param {*} param1 
 */
function getCookieByName(cookieName, { req }) {
  // all cookies are saved in one string and seperated by "; "
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

/**
 * 
 * @param {*} ctx 
 * @param {*} path 
 */
function reject(ctx, path) {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: path });
    ctx.res.end();
  } else {
    Router.push(path);
  }
}

/**
 * 
 * @param {*} token 
 */
export function login(token) {
  const now = new Date();
  // expires in 12 hours
  now.setHours(now.getHours + 12);
  document.cookie = `token=${token}; expires=${now.toUTCString()}; path=/`;
  Router.push('/');
}

/**
 * 
 */
export function logout() {
  // expires now
  document.cookie = `token=; expires=${new Date().toUTCString()}; path=/`;
  Router.push('/login');
}

/**
 * 
 * @param {*} ctx 
 */
export async function auth (ctx, apiUrl) {
  const token = getCookieByName('token', ctx);

  if (!token) {
    reject(ctx, '/login');
    throw new UnauthorizedError('missing jwt', ctx);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const res = await axios.get(`${apiUrl}/users/${decoded._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return { user: res.data, token };
  } catch {
    reject(ctx, '/login');
    throw new UnauthorizedError('invalid jwt', ctx);
  }
}

/**
 * 
 * @param {*} ctx 
 */
export function noAuth(ctx) {
  const token = getCookieByName('token', ctx);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) reject(ctx, '/');
    });
  }
}
