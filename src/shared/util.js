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

function getAuthenticatedUser(request) {
  const accessToken = request.cookies.at;
  if (typeof accessToken === 'string') {
    const { userId, username } = jwt.verify(accessToken, AUTH_SECRET);
    return { userId, username };
  }

  throw new AuthenticationError('Not Authenticated');
}

function checkUserAuthenticated(request) {
  return !!getAuthenticatedUser(request);
}

function createAuthCookie(token, request) {
  const options = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  };

  return request.res.cookie('at', token, options);
}

function destroyAuthCookie(request) {
  return request.res.cookie('at', { maxAge: 0 });
}

module.exports = {
  startCase,
  createAuthCookie,
  destroyAuthCookie,
  getAuthenticatedUser,
  checkUserAuthenticated,
};
