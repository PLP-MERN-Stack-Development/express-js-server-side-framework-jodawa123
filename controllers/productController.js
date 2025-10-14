const Product = require('../models/Product');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { getPagination } = require('../utils/pagination');

// Get all products with filtering and pagination
const getAllProducts = async (req, res, next) => {
  try {
    const { category, inStock, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    
    if (category) filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const { skip, limit: queryLimit } = getPagination(page, limit);
    
    const products = await Product.find(filter)
      .skip(skip)
      .limit(queryLimit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: queryLimit,
        total,
        pages: Math.ceil(total / queryLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Create new product
const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search products
const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      throw new ValidationError('Search query is required');
    }

    const { skip, limit: queryLimit } = getPagination(page, limit);

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(queryLimit);

    const total = await Product.countDocuments({ $text: { $search: q } });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: queryLimit,
        total,
        pages: Math.ceil(total / queryLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get product statistics
const getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          inStockCount: {
            $sum: { $cond: ['$inStock', 1, 0] }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          inStockCount: 1,
          outOfStockCount: { $subtract: ['$count', '$inStockCount'] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalInStock: { $sum: { $cond: ['$inStock', 1, 0] } },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byCategory: stats,
        overall: totalStats[0] || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductStats
};