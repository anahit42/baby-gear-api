const config = require('config');
const FileType = require('file-type');
const Promise = require('bluebird');

const { ProductModel } = require('../models');
const { NotFoundError, ForbiddenError } = require('../errors');
const S3Lib = require('../libs/s3-lib');

const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');

function withoutUndefinedValue(object) {
  Object.keys(object).forEach((key) => !object[key] && delete object[key]);
  return object;
}

function updatedSubDocument(propertyValue = {}, propertyKey) {
  return Object.keys(propertyValue).reduce((updatedObject, key) => {
    updatedObject[`${propertyKey}.${key}`] = propertyValue[key];
    return updatedObject;
  }, {});
}

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
      subCategories,
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
      userId,
    });
    return res.status(200).json({ result: product });
  } catch (error) {
    return next(error);
  }
}

async function getProduct(req, res, next) {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return res.status(200).json({
      result: product,
    });
  } catch (error) {
    return next(error);
  }
}

async function getProducts(req, res, next) {
  const { limit, skip } = req.query;
  try {
    const [products, total] = await Promise.all([
      ProductModel.countDocuments(),
      ProductModel.find().limit(limit).skip(skip),
    ]);

    return res.status(200).json({
      results: products,
      total,
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserProducts(req, res, next) {
  const { userId } = req.params;
  const { _id } = req.userData;
  const { skip, limit } = req.query;

  try {
    if (userId !== _id.toString()) {
      throw new ForbiddenError('You\'re not allowed to view this resource');
    }

    const [products, total] = await Promise.all([
      ProductModel.find({ userId }).limit(limit).skip(skip),
      ProductModel.countDocuments(),
    ]);

    return res.status(200).json({
      data: products,
      total,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const userId = req.userData._id;
    const findQuery = { _id: productId, userId };
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
      subCategories,
    } = req.body;

    const updatedFields = {
      name,
      description,
      price,
      $set: {
        ...updatedSubDocument(properties, 'properties'),
        ...updatedSubDocument(customProperties, 'customProperties'),
      },
      condition,
      status,
      quantity,
      brand,
      country,
      issueDate,
      $addToSet: { subCategories: [...subCategories] },
    };
    const update = withoutUndefinedValue(updatedFields);

    const product = await ProductModel.findOneAndUpdate(findQuery, update, { new: true });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return res.status(200).json({ result: product });
  } catch (error) {
    return next(error);
  }
}

async function uploadImages(req, res, next) {
  try {
    const { productId } = req.params;
    const { _id } = req.userData;
    const product = await ProductModel.findOne({ _id: productId, userId: _id });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const distFileKeys = [];
    const urls = [];

    // Loop each file
    await Promise.map(req.files, async (file) => {
      try {
        const fileType = await FileType.fromBuffer(file.buffer);

        const data = await S3Lib.uploadFileToS3({
          bucket: bucketName,
          key: accessKeyId,
          secret: secretAccessKey,
          fileBuffer: file.buffer,
          fileMimeType: fileType.mime,
          distFilePath: `${productId}/${file.originalname}`,
        });
        distFileKeys.push(data.key);

        const url = S3Lib.getSignedUrl({
          bucket: bucketName,
          key: accessKeyId,
          secret: secretAccessKey,
          distFileKey: data.Key || data.key,
          mimeType: fileType.mime,
        });
        urls.push(url);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    });

    // Save image urls in db
    await ProductModel.updateOne({ _id: productId }, { $addToSet: { images: distFileKeys } });

    return res.status(200).json({
      message: 'Success',
      imageUrls: urls,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  getUserProducts,
  uploadImages,
};
