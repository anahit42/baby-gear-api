const JWT = require('jsonwebtoken');
const config = require('config');
const FileType = require('file-type');


const { UserModel } = require('../models');
const s3Lib = require('../libs/s3-lib');
const { ValidationError, ForbiddenError } = require('../errors');

const jwt = config.get('jwt');
const aws = config.get('aws');

const getFileType = async (file) => FileType.fromBuffer(file.buffer);

async function getUser (req, res, next) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded._id.toString()) {
      return res.status(401).json({
        error: 'Not Authorized'
      });
    }

    const user = await UserModel.findOne({ _id: userId }).select({
      password: 0,
      email: 0,
      mobilePhone: 0,
      address: 0
    });

    return res.status(200).json({
      user
    });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  const { limit, skip } = req.query;

  try {
    const [ users, total ] = await Promise.all([
      UserModel.find({}).select({
        password: 0,
        email: 0,
        mobilePhone: 0,
        address: 0
      }).limit(limit).skip(skip),
      UserModel.countDocuments({})
    ]);

    return res.status(200).json({
      results: users,
      total
    });
  } catch (error) {
    return next(error);
  }
}

async function uploadProfilePic (req, res, next) {
  try {
    const { file } = req;
    const { userId } = req.params;
    const { authorization } = req.headers;
    const { bucketName, accessKey, secretKey } = aws;

    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded._id.toString()) {
      return next(new ForbiddenError('Access to the requested resource is forbidden.'));
    }

    const fileType = await getFileType(file);

    if (!fileType.mime) {
      return next(new ValidationError('Only images allowed'));
    }

    const data = await s3Lib.uploadFileToS3({
      bucket: bucketName,
      key: accessKey,
      secret: secretKey,
      fileBuffer: file.buffer,
      fileMimeType: fileType.mime,
      distFilePath: `${userId}/${file.originalname}`,
    });

    const url = s3Lib.getSignedUrl({
      bucket: bucketName,
      key: accessKey,
      secret: secretKey,
      distFileKey: data.Key || data.key,
      mimeType: fileType.mime,
    });

    await UserModel.findByIdAndUpdate(userId, { image: url });

    return res.status(200).json({
      image: data.Key || data.key,
    });

  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUser,
  getUsers,
  uploadProfilePic,
};
