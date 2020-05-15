const config = require('config');
const FileType = require('file-type');
const Promise = require('bluebird');

const { ProductModel } = require('../models');
const S3Lib = require('../libs/s3-lib');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');


async function uploadImages(req, res, next) {
  try {
    const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');

    const { productId } = req.params;
    const { _id } = req.userData;
    const product = await ProductModel.findOne({ _id: productId }).select('userId');
    let distFileKeys = [];
    let urls = [];

    // Check product exists in db
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Validation for self product update
    if (product.userId.toString() !== _id) {
      throw new ForbiddenError('You don\'t have permission to do that');
    }

    // Loop each file
    await Promise.map(req.files, async (file) => {
      try {
        const fileType = await FileType.fromBuffer(file.buffer);

        // Upload file to cloud
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
    const updateData = await ProductModel.updateOne({ _id: productId }, { $addToSet: { images: distFileKeys } });

    if (!updateData.ok) {
      throw new Error('Something went wrong, please try again.');
    }

    return res.status(200).json({
      message: 'Success',
      imageUrls: urls
    });
  } catch(error) {
    return next(error);
  }
}

module.exports = {
  uploadImages
};
