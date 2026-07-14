const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // This passes the error to the errorHandler below
};

const errorHandler = (err, req, res, next) => {
  // Sometimes errors happen before a status code is set, default to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Handle specific Mongoose CastErrors (e.g., invalid ObjectIDs)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    err.message = 'Resource not found';
  }

  // Handle Mongo duplicate key errors (e.g. race-condition double submits)
  if (err.code === 11000) {
    statusCode = 409;
    err.message = 'A record with these details already exists.';
  }

  // Handle Mongoose schema validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    err.message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  res.status(statusCode).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };