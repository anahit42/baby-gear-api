const { ProductModel } = require('../models');
const { NotFoundError } = require('../errors');
const ValidationError = require('../errors/validation-error');

function withoutUndefinedValue(object) {
  Object.keys(object).forEach(key => !object[key] && delete object[key]);
  return object;
}

function updatedSubDocument(propertyValue = {}, propertyKey) {
  return  Object.keys(propertyValue).reduce((updatedObject,key) => {
    updatedObject[`${propertyKey}.${key}`] = propertyValue[key];
    return updatedObject;
  },{});
}

async function createProduct (req, res, next) {
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
    return res.status(200).json({ result: product });
  } catch (error) {
    return next(error);
  }
}

async function getProduct (req, res, next) {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return res.status(200).json({
      result: product
    });
  } catch (error) {
    return next(error);
  }
}

async function getProducts (req,res,next) {
  const { limit, skip } = req.query;
  try {
    if(isNaN(limit) | isNaN(skip) | limit < 0 | skip < 0 | limit % 1 != 0 | skip % 1 != 0) {
      return next(new ValidationError('Invalid parameter'));
    }
    const results = {};
    results.total = await ProductModel.countDocuments();
    results.data = await ProductModel.find().limit(parseInt(limit)).skip(parseInt(skip));

    return res.status(200).json({
      results
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const userId = req.userData._id;
    const findQuery  = { _id: productId, userId };
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

    const updatedFields = {
      name,
      description,
      price,
      $set : {
        ...updatedSubDocument(properties, 'properties'),
        ...updatedSubDocument(customProperties, 'customProperties')
      },
      condition,
      status,
      quantity,
      brand,
      country,
      issueDate,
      $addToSet: { 'subCategories' : [...subCategories] }
    };
    const update = withoutUndefinedValue(updatedFields);

    const product = await ProductModel.findOneAndUpdate(findQuery, update, { 'new': true});

    if(!product){
      throw new NotFoundError('Product not found');
    }

    return res.status(200).json({ result: product });
  } catch (error) {
    return  next(error);
  }
}

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
};
