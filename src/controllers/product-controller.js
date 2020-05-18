const config = require('config');
const FileType = require('file-type');
const Promise = require('bluebird');

const { ProductModel } = require('../models');
const S3Lib = require('../libs/s3-lib');
const { NotFoundError } = require('../errors');

const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');

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
  uploadImages
};
