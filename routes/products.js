const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductStats
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProductById);

// Protected routes (require API key)
router.post('/', authenticate, validateProduct, createProduct);
router.put('/:id', authenticate, validateProduct, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;