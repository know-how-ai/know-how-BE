const logger = require("../logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  return res.status(err.status || 500).json({
    message: err.message,
    status: false,
  });
};

module.exports = {
  errorHandler,
};
