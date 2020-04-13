import Router from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { UnauthorizedError } from './errors';

/**
 * This helper function will search the users browser for a cookie with the given name.
 * It will then return the content of the cookie.
 * The function was written to avoid a unnecessary libary like js-cookie.
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
 * This helper function will be invoked, when a user has to be redirected.
 * It is necessary to use such a function because redirecting a user has to be done
 * differently on the server / client.
 * @param {*} ctx 
 * @param {*} path 
 */
function redirect(ctx, path) {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: path });
    ctx.res.end();
  } else {
    Router.push(path);
  }
}

/**
 * Will log an authorized user in by creating a cookie named token with the jwt in it.
 * This cookie will expire in 12 hours.
 * The user is redirected to / .
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
 * Will log an authorized user out by expirering his cookie immediately.
 * The user will then be redirected to /login.
 */
export function logout() {
  // expires now
  document.cookie = `token=; expires=${new Date().toUTCString()}; path=/`;
  Router.push('/login');
}

/**
 * Checks if a cookie with the name token exits.
 * If so the jwt inside the cookie gets validated.
 * If this succeeds the user may proceed, if not he is redirected to /login.
 * @param {*} ctx 
 * @param {*} apiUrl 
 */
export async function auth (ctx, apiUrl) {
  const token = getCookieByName('token', ctx);

  if (!token) {
    redirect(ctx, '/login');
    throw new UnauthorizedError('missing jwt', ctx);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const res = await axios.get(`${apiUrl}/users/${decoded._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return { user: res.data, token };
  } catch {
    redirect(ctx, '/login');
    throw new UnauthorizedError('invalid jwt', ctx);
  }
}

/**
 * Checks if a cookie with the name token exits.
 * If not the user may proceed, if so he will be redirected to /.
 * NOTE: In case of a existing, but unvalid token a loop will accrue.
 * This behavior is desired, because the browser (tested on firefox, chrome, vivaldi)
 * will show a prompt asking the user to delete his cookies.
 * @param {*} ctx 
 */
export function noAuth(ctx) {
  const token = getCookieByName('token', ctx);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) redirect(ctx, '/');
    });
  }
}
