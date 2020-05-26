const config = require('config');
const S3Lib = require('../libs/s3-lib');

async function uploadAndUpdateModelItem(playload, ItemModel) {

  const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');
  const { file, fileType, _id } = playload;

  const data = await S3Lib.uploadFileToS3({
    bucket: bucketName,
    key: accessKeyId,
    secret: secretAccessKey,
    fileBuffer: file.buffer,
    fileMimeType: fileType.mime,
    distFilePath: `${_id}/${file.originalname}`,
  });

  const fileKey = data.Key || data.key;
  let doc = await ItemModel.findByIdAndUpdate(_id, { image: fileKey });

  return S3Lib.getSignedUrl({
    bucket: bucketName,
    key: accessKeyId,
    secret: secretAccessKey,
    distFileKey: fileKey,
    mimeType: fileType.mime,
  });
}

module.exports = { uploadAndUpdateModelItem };
