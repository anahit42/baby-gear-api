function sendErrorResponse(res, status, message) {
  console.log('in send error message');
  res.status(status).json({
    error: message
  });
}

module.exports = { sendErrorResponse };
