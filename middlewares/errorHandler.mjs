export default (err, req, res, next) => {
  const response = {
    error: {
      message: err.message || 'Something went wrong',
      ...(err.code && { code: err.code })
    }
  };
  const statusCode = err.statusCode || 500;

  // Development-only details
  if (process.env.NODE_ENV === 'development') {
    response.error = {
      ...response.error,
      stack: err.stack,
      originalError: {
        name: err.name,
        details: err.details
      }
    };
    console.error('Error:', err);
  }

  res.status(statusCode).json(response);
};