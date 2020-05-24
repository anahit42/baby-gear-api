const config = require('config');

const CryptoLib = require('../libs/crypto-lib');
const S3Lib = require('../libs/s3-lib');
const FileManagerLib = require('../libs/file-manager-lib');
const { UserModel } = require('../models');
const { ValidationError, ConflictError, ForbiddenError } = require('../errors');
const { CommonUtil, ResponseHandlerUtil } = require('../utils');

const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');

async function getUser(req, res, next) {
  const { userId } = req.params;

  try {
    if (userId !== req.userData._id) {
      throw new ForbiddenError('Not Authorized!');
    }

    const user = await UserModel.findOne({ _id: userId }).select({
      password: 0,
      email: 0,
      mobilePhone: 0,
      address: 0,
    });

    if (user.image) {
      user.image = S3Lib.getSignedUrl({
        bucket: bucketName,
        key: accessKeyId,
        secret: secretAccessKey,
        distFileKey: user.image,
      });
    }

    return ResponseHandlerUtil.handleGet(res, user);
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  const { limit, skip } = req.query;

  try {
    if (req.userData.role !== 'admin') {
      throw new ForbiddenError('Access to the requested resource is forbidden.');
    }

    const [users, total] = await Promise.all([
      UserModel.find({}).select({
        password: 0,
        email: 0,
        mobilePhone: 0,
        address: 0,
      }).limit(limit).skip(skip),
      UserModel.countDocuments({}),
    ]);

    users.forEach(users, (user) => {
      if (user.image) {
        user.image = S3Lib.getSignedUrl({
          bucket: bucketName,
          key: accessKeyId,
          secret: secretAccessKey,
          distFileKey: user.image,
        });
      }
    });

    return ResponseHandlerUtil.handleList(res, users, total);
  } catch (error) {
    return next(error);
  }
}

async function uploadProfilePic(req, res, next) {
  try {
    const { file } = req;
    const { userId } = req.params;

    if (userId !== req.userData._id) {
      throw new ForbiddenError('Access to the requested resource is forbidden.');
    }

    const fileType = await FileManagerLib.getFileType(file);

    if (!fileType.mime) {
      throw new ValidationError('Only images allowed');
    }

    const data = await S3Lib.uploadFileToS3({
      bucket: bucketName,
      key: accessKeyId,
      secret: secretAccessKey,
      fileBuffer: file.buffer,
      fileMimeType: fileType.mime,
      distFilePath: `${userId}/${file.originalname}`,
    });

    const fileKey = data.Key || data.key;

    await UserModel.findByIdAndUpdate(userId, { image: fileKey });

    const url = S3Lib.getSignedUrl({
      bucket: bucketName,
      key: accessKeyId,
      secret: secretAccessKey,
      distFileKey: fileKey,
      mimeType: fileType.mime,
    });

    return ResponseHandlerUtil.handleUpdate(res, { url });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  const { userId } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    const updateFields = CommonUtil.removeObjectUndefinedValues({
      firstName, lastName, email, password,
    });

    if (password) {
      updateFields.password = await CryptoLib.hashPassword(password);
    }

    if (userId !== req.userData._id) {
      throw new ForbiddenError('Not Authorized!');
    }

    if (email) {
      const existUser = await UserModel.exists({ email });

      if (existUser) {
        throw new ConflictError('Not Authorized!');
      }
    }

    await UserModel.updateOne({ _id: userId }, updateFields);

    return ResponseHandlerUtil.handleUpdate(res);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUser,
  updateUser,
  getUsers,
  uploadProfilePic,
};
