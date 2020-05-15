const { ProductModel } = require('../models');

const createProduct = async (req, res, next)=> {
  try {
    const {
      name,
      description,
      price,
      properties,
      customProperties,
      condition,
      status,
      quantity,
      brand,
      country,
      issueDate,
      subCategories
    } = req.body;
    const userId = req.userData._id;
    const product = await ProductModel.create({
      name,
      description,
      price,
      properties,
      customProperties,
      condition,
      status,
      quantity,
      brand,
      country,
      issueDate,
      subCategories,
      userId
    });
    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProduct
};
