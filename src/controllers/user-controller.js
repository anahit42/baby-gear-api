const JWT = require('jsonwebtoken');
const config = require('config');
const FileType = require('file-type');

const jwt = config.get('jwt');
const aws = config.get('aws');

const { UserModel } = require('../models');

const s3Lib = require('../libs/s3-lib');

const ValidationError = require('../errors/validation-error');

async function getUser (req, res, next) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded.id.toString()) {
      return res.status(401).json({
        error: 'Not Authorized'
      });
    }

    const user = await UserModel.findOne({ _id: userId }).select({
      password: 0
    });

    return res.status(200).json({
      user
    });
  } catch (error) {
    return next(error);
  }

}

const getFileType = async (file) => FileType.fromBuffer(file.buffer);

async function uploadProfilePic (req, res, next) {
  try {
    const { file } = req;
    const { userId } = req.params;
    const { bucketName, accessKey, secretKey } = aws;

    const fileType = await getFileType(file);

    if (!fileType.mime) {
      next(new ValidationError('Only images allowed'));
    }

    const data = await s3Lib.uploadFileToS3({
      bucket: bucketName,
      key: accessKey,
      secret: secretKey,
      fileBuffer: file.buffer,
      fileMimeType: fileType.mime,
      distFilePath: file.originalname,
    });

    const url = await s3Lib.getSignedUrl({
      bucket: bucketName,
      key: accessKey,
      secret: secretKey,
      distFileKey: data.Key || data.key,
      mimeType: file.mimetype,
    });

    if (url) {
      await UserModel.findByIdAndUpdate(userId, { image: url })
        .then(() => {
          return res.status(200).json({
            image: url,
          });
        });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUser,
  uploadProfilePic,
};
