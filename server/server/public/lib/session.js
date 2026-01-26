import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SESSION_COOKIE = 'totwise_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 45;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('Missing SESSION_SECRET');
}

export function signSession(payload) {
  return jwt.sign(payload, SESSION_SECRET, { expiresIn: SESSION_TTL_SECONDS });
}

export function verifySession(token) {
  return jwt.verify(token, SESSION_SECRET);
}

export function setSessionCookie(res, token) {
  const cookie = serialize(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SECONDS
  });
  res.setHeader('Set-Cookie', cookie);
}

export function clearSessionCookie(res) {
  const cookie = serialize(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0)
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getSessionToken(req) {
  if (req.cookies && req.cookies[SESSION_COOKIE]) {
    return req.cookies[SESSION_COOKIE];
  }
  const header = req.headers.cookie || '';
  const match = header.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}
