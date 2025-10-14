const { ValidationError } = require('../utils/errors');

const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Product description is required');
  }

  if (price === undefined || price === null) {
    errors.push('Product price is required');
  } else if (typeof price !== 'number' || price < 0) {
    errors.push('Price must be a positive number');
  }

  if (!category || !['animal', 'food', 'item', 'fantasy', 'cartoon'].includes(category)) {
    errors.push('Valid category is required (animal, food, item, fantasy, cartoon)');
  }

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  next();
};

module.exports = { validateProduct };