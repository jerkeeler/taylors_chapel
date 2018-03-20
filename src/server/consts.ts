const IS_PROD = process.env.NODE_ENV === 'production';
const WHITELISTED_ERRORS = [
  404
];
const COOKIE_OPTS = {
  secure: IS_PROD,
  sameSite: true,
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  proxy: IS_PROD
};
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const MAX_LOG_SIZE = 5242800; // 5MB
const MAX_LOG_FILES = 5;
const GOOGLE_SCOPE = ['https://www.googleapis.com/auth/plus.login'];
const TOKEN_LENGTH = 6;
const UPPERCASE_CHARS = Array(26).fill(0).map((_, i) => String.fromCharCode(i + 65));
const LOWERCASE_CHARS = UPPERCASE_CHARS.map(val => val.toLowerCase());
const TOKEN_CHARS = UPPERCASE_CHARS.concat(LOWERCASE_CHARS);
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;

export {
  IS_PROD,
  WHITELISTED_ERRORS,
  COOKIE_OPTS,
  LOG_LEVEL,
  MAX_LOG_SIZE,
  MAX_LOG_FILES,
  GOOGLE_SCOPE,
  TOKEN_LENGTH,
  TOKEN_CHARS,
  EMAIL_REGEX
};
