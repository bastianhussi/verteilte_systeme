import Router from 'next/router';
import jwt from 'jsonwebtoken';

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
  // cookie.remove('token')
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now());
  Router.push('/login');
}

export function auth(ctx) {
  const token = getCookieByName('token', ctx);

  if (!token) {
    if (ctx.req) {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();
      return;
    }
    Router.push('/login');
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (ctx.req) {
          ctx.res.writeHead(302, { Location: '/login' });
          ctx.res.end();
        } else {
          Router.push('/login');
        }
      }
    });
  }

  return token;
}

export function noAuth(ctx) {
  const token = getCookieByName('token', ctx);

  if (token) {
    if (ctx.req) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    } else {
      Router.push('/');
    }
  }
}
