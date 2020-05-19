const { ProductModel } = require('../models');
const { NotFoundError } = require('../errors');

async function createProduct(req, res, next) {
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
}

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
      return next(new NotFoundError('Product not found'));
    }
    return res.status(200).json(product);

  } catch (error) {
    return  next(error);
  }
}
module.exports = {
  createProduct,
  updateProduct
};
