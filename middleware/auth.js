const { UnauthorizedError } = require('../utils/errors');

const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Get valid API keys from environment variables
  const validApiKeys = process.env.VALID_API_KEYS 
    ? process.env.VALID_API_KEYS.split(',') 
    : ['plushies-123', 'stuffies-456', 'admin-789'];
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    throw new UnauthorizedError('Valid API key required. Include x-api-key header with valid key.');
  }
  
  next();
};

module.exports = authenticate;