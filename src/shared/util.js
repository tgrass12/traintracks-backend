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

function isUserAuthenticated(ctx) {
  return !!ctx.request.session.username;
}

module.exports = {
  startCase,
  isUserAuthenticated,
};
