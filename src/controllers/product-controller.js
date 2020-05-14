const config = require('config');
const fs = require('fs');
const FileType = require('file-type');

const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');
const validMimes = config.get('image.validMimes');

const { ProductModel } = require('../models');
const S3Lib = require('../libs/s3-lib');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');


async function uploadImages(req, res, next) {
  try {
    // Check product exists in db
    const { id } = req.params;
    const isProductExists = await ProductModel.exists({ _id: id });
    let urls = [];

    if (! isProductExists) {
      return next(new NotFoundError('Product not found'));
    }

    // Loop each file
    req.files.forEach(async (file) => {
      // Get file buffer and type, check accessible file types.
      const fileBody = fs.createReadStream(file.path);
      const fileType = await FileType.fromStream(fileBody);

      if(!validMimes.includes(fileType.mime)) {
      // TODO: maybe handle another way
        return next(new ValidationError('Please send valid files'));
      }

      // Upload files to cloud
      const data = await S3Lib.uploadFileToS3({
        bucket: bucketName,
        key: accessKeyId,
        secret: secretAccessKey,
        fileBuffer: fileBody,
        fileMimeType: fileType.mime,
        distFilePath: file.originalname
      });

      const url = await S3Lib.getSignedUrl({
        bucket: bucketName,
        key: accessKeyId,
        secret: secretAccessKey,
        distFileKey: data.Key || data.key,
        mimeType: fileType.mime,
      });

      urls.push(url);
    });
  } catch(error) {
    console.log(error);
  }

  // Save urls in db

}

module.exports = {
  uploadImages
};
