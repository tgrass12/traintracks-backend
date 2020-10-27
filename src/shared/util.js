const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-errors');

const { AUTH_SECRET } = process.env;

/* Converts a string to start case format
 * Ex: "vitamin c" => "Vitamin C"
 */
function startCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function getAuthenticatedUserId(ctx) {
  const accessToken = ctx.request.cookies.at;
  if (accessToken) {
    const { userId } = jwt.verify(accessToken, AUTH_SECRET);
    return userId;
  }

  throw new AuthenticationError('Not Authenticated');
}

function checkUserAuthenticated(ctx) {
  return !!getAuthenticatedUserId(ctx);
}

function createAuthCookie(token, ctx) {
  const options = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  };

  return ctx.request.res.cookie('at', token, options);
}

module.exports = {
  startCase,
  createAuthCookie,
  getAuthenticatedUserId,
  checkUserAuthenticated,
};
