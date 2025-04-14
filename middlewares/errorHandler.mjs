export default (err, req, res, next) => {
  const errorResponse = {
    error: {
      code: err.code || 'GENERIC_ERROR',
      message: 'Something went wrong',
      details: []
    }
  };
  let statusCode = err.statusCode || 500;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.error.message = 'Validation failed';
    errorResponse.error.details = err.details;
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    errorResponse.error.message = 'Duplicate entry conflict';
  } else if (err.status === 404) {
    statusCode = 404;
    errorResponse.error.message = 'Resource not found';
  }
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
    errorResponse.error.stack = err.stack;
  } else {
    console.error('Error:', {
      message: err.message,
      code: err.code,
      route: req.originalUrl
    });
  }

  if (statusCode === 500) {
    errorResponse.error.message = 'Internal server error';
  } else if (err.message && statusCode < 500) {
    errorResponse.error.message = err.message;
  }
  res.status(statusCode).json(errorResponse);
};