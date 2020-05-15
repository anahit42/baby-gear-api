const HttpStatus = require('http-status-codes');
const TokenLib = require('../libs/token-lib');

const { UserModel } = require('../models');

async function getUser (req, res, next) {

  const { userId } = req.params;
  const { authorization } = req.headers;

  try {

    TokenLib.checkLoginToken(res, userId, authorization);

    const user = await UserModel.findOne({ _id: userId }).select({
      password: 0,
      address: 0,
      email: 0
    });

    return res.status(HttpStatus.OK).json({
      user
    });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const { userId } = req.params;
    const { authorization } = req.headers;
    const { limit, page } = req.params;

    TokenLib.checkLoginToken(res, userId, authorization);

    // add pagination
    const users = await UserModel.find().skip(limit * page).limit(limit).select({
      password: 0,
      address: 0,
      email: 0
    });

    return res.status(HttpStatus.OK).json({
      users
    });

  } catch (error) {
    return next(error);
  }
}

const fsExtra = require('fs-extra');
const s3Lib = require('../libs/s3-lib');
const config = require('config');
const aws = config.get('aws');

async function uplaodImage(req, res, next) {

  const { userId } = req.params;
  const { authorization } = req.headers;
  console.log('userId = ' + userId);
  console.log('req.files = ' + req.files);
  console.log('req.file = ' + req.body.files);

  TokenLib.checkLoginToken(res, userId, authorization);
  // const { originalname,
  //   encoding,
  //   mimetype,
  //   size,
  //   destination,
  //   filename,
  //   path,
  //     //buffer
  //     } = req.body.file;

  try{
    console.log(req.body);

    const buffer = await fsExtra.readFile(req.body.file.destination);

    const data = await s3Lib.uploadFileToS3({ bucket: aws.bucketName,
      key: aws.accessId,
      secret: aws.secretKey,
      fileBuffer: buffer,
      fileMimeType: req.body.file.mimeType,
      destFilePath: req.body.file.destination,
    });

    const url = await s3Lib.getSignedUrl({bucket: aws.bucketName,
      key: aws.accessId,
      secret: aws.secretKey,
      destFileKey: data.Key || data.key,
      mimeType: req.file.mimeType,
    });

    const user = await UserModel.findByIdAndUpdate({ _id: userId }, { image: url }).select({
      password: 0,
      address: 0,
      email: 0
    });

    return res.status(HttpStatus.OK).json({
      user
    });

  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUser,
  getUsers,
  uplaodImage
};
