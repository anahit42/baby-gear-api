const { ProductModel } = require('../models');

const createProduct = async (req,res,next)=> {
  try {
    const productBody = req.body;
    const product = await ProductModel.create(productBody);
    return res.status(200).json(product);
  }catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct
};
