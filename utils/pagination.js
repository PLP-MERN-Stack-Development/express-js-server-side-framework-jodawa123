const getPagination = (page, size) => {
  const limit = size ? parseInt(size) : 10;
  const skip = page ? (parseInt(page) - 1) * limit : 0;
  return { limit, skip };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: products } = data;
  const currentPage = page ? parseInt(page) : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    products,
    totalPages,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

module.exports = { getPagination, getPagingData };