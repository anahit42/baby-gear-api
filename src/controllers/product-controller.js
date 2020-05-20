const config = require('config');
const FileType = require('file-type');
const Promise = require('bluebird');

const { ProductModel } = require('../models');
const { NotFoundError, ValidationError } = require('../errors');
const { RemoveObjectUndefinedValue, FormatUpdateSubDocument} = require('../utils');
const S3Lib = require('../libs/s3-lib');

const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');

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
        ...FormatUpdateSubDocument(properties, 'properties'),
        ...FormatUpdateSubDocument(customProperties, 'customProperties')
      },
      condition,
      status,
      quantity,
      brand,
      country,
      issueDate,
      $addToSet: { 'subCategories' : [...subCategories] }
    };
    const update = RemoveObjectUndefinedValue(updatedFields);

    const product = await ProductModel.findOneAndUpdate(findQuery, update, { 'new': true});

    if(!product){
      throw new NotFoundError('Product not found');
    }

    return res.status(200).json({ result: product });
  } catch (error) {
    return  next(error);
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

    let distFileKeys = [];
    let urls = [];

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
          distFilePath: `${productId}/${file.originalname}`
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
        console.log(error);
      }
    });

    // Save image urls in db
    await ProductModel.updateOne({ _id: productId }, { $addToSet: { images: distFileKeys } });

    return res.status(200).json({
      message: 'Success',
      imageUrls: urls
    });
  } catch(error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  uploadImages,
};
