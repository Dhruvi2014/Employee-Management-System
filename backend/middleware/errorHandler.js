const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with this email address already exists.',
      error: 'Unique constraint violation',
    });
  }

  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format provided for employee identifier.',
      error: 'Invalid input syntax',
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
