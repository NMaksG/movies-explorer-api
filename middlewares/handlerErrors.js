const { messageHenErr } = require('../utils/contants');

module.exports.handlerErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? messageHenErr
        : message,
    });
  next(err);
};
