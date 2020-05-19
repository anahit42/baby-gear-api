const AwsSdk = require('aws-sdk');

class S3Lib {
  /**
   * @public
   * @param {Object} payload
   * @param {string} payload.bucket
   * @param {string} payload.key
   * @param {string} payload.secret
   * @param {Buffer} payload.fileBuffer
   * @param {string} payload.fileMimeType
   * @param {string} payload.distFilePath
   * @description Upload file to s3.
   */
  static async uploadFileToS3 (payload) {
    const { bucket, key, secret, fileBuffer, fileMimeType, distFilePath } = payload;

    const s3Bucket = new AwsSdk.S3({
      accessKeyId: key,
      secretAccessKey: secret
    });

    const params = {
      Bucket: bucket,
      Key: distFilePath,
      Body: fileBuffer,
      ContentType: fileMimeType
    };

    return s3Bucket.upload(params).promise();
  }

  /**
   * @public
   * @param {Object} payload
   * @param {string} payload.bucket
   * @param {string} payload.key
   * @param {string} payload.secret
   * @param {string} payload.distFileKey
   * @param {string} [payload.mimeType]
   * @param {number} [payload.expires]
   * @description Get signed URL.
   */
  static getSignedUrl (payload) {
    const { bucket, key, secret, distFileKey, mimeType, expires } = payload;

    const s3Bucket = new AwsSdk.S3({
      accessKeyId: key,
      secretAccessKey: secret
    });

    const params = {
      Bucket: bucket,
      Key: distFileKey,
      ResponseContentType: mimeType,
      Expires: expires
    };

    return s3Bucket.getSignedUrl('getObject', params);
  }
}

module.exports = S3Lib;
