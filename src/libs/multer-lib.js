const multer = require('multer');
const config = require('config');

const ValidationError = require('../errors/validation-error');

const allowedMimeTypes = config.get('image.validMimes');

const storage = multer.memoryStorage();

const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new ValidationError('Only images are allowed'));
    }
    cb(null, true);
  }
});

module.exports = {
  uploadImage,
};
