module.exports.errorHandler = function (err, req, res, next) {
  if (res.statusCode === 200) res.status(500);
  let message = err.message || err;
  console.warn(err);
  res.json({ err: message });
};
