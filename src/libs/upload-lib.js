const config = require('config');
const S3Lib = require('./s3-lib');

const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');

async function uploadAndUpdateModelItem(payload, ItemModel) {
  const { file, fileType, _id, updateField } = payload;

  const data = await S3Lib.uploadFileToS3({
    bucket: bucketName,
    key: accessKeyId,
    secret: secretAccessKey,
    fileBuffer: file.buffer,
    fileMimeType: fileType.mime,
    distFilePath: `${_id}/${file.originalname}`,
  });

  const fileKey = data.Key || data.key;
  await ItemModel.findByIdAndUpdate(_id, { [updateField]: fileKey });

  return S3Lib.getSignedUrl({
    bucket: bucketName,
    key: accessKeyId,
    secret: secretAccessKey,
    distFileKey: fileKey,
    mimeType: fileType.mime,
  });
}

module.exports = {
  uploadAndUpdateModelItem,
};
