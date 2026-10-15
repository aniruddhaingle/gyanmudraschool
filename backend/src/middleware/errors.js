export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

// Express only treats a middleware as an error handler when it declares all four arguments.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  const status = error.name === "MulterError" ? 400 : error.status || error.statusCode || 500;
  const message = error.code === "LIMIT_FILE_SIZE"
    ? "One of the photos is too large. Each photo must be under 10 MB."
    : status === 500 ? "Internal server error" : error.message;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({ message });
}
