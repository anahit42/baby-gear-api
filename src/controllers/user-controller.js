const JWT = require('jsonwebtoken');
const config = require('config');
const FileType = require('file-type');

const { UserModel } = require('../models');
const { ValidationError, ConflictError, ForbiddenError } = require('../errors');
const CryptoLib = require('../libs/crypto-lib');
const s3Lib = require('../libs/s3-lib');

const jwt = config.get('jwt');
const { accessKeyId, secretAccessKey, bucketName } = config.get('aws');

const getFileType = async (file) => FileType.fromBuffer(file.buffer);

function removeUndefinedValues(object) {
  Object.keys(object).forEach((key) => !object[key] && delete object[key]);
  return object;
}

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

    return res.status(200).json({
      user,
    });
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

    return res.status(200).json({
      results: users,
      total,
    });
  } catch (error) {
    return next(error);
  }
}

async function uploadProfilePic(req, res, next) {
  try {
    const { file } = req;
    const { userId } = req.params;
    const { authorization } = req.headers;

    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded._id.toString()) {
      return next(new ForbiddenError('Access to the requested resource is forbidden.'));
    }

    const fileType = await getFileType(file);

    if (!fileType.mime) {
      throw new ValidationError('Only images allowed');
    }

    const data = await s3Lib.uploadFileToS3({
      bucket: bucketName,
      key: accessKeyId,
      secret: secretAccessKey,
      fileBuffer: file.buffer,
      fileMimeType: fileType.mime,
      distFilePath: `${userId}/${file.originalname}`,
    });
    const fileKey = data.Key || data.key;

    await UserModel.findByIdAndUpdate(userId, { image: fileKey });

    const url = s3Lib.getSignedUrl({
      bucket: bucketName,
      key: accessKeyId,
      secret: secretAccessKey,
      distFileKey: fileKey,
      mimeType: fileType.mime,
    });

    return res.status(200).json({
      data: { url },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  const { userId } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    const updateFields = removeUndefinedValues({
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

    return res.status(200).json({
      data: { firstName, lastName, email },
    });
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
