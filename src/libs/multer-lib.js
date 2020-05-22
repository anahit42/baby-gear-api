const multer = require('multer');
const config = require('config');

const ValidationError = require('../errors/validation-error');

const validMimes = config.get('image.validMimes');

const storage = multer.memoryStorage();

function imageFileFilter(req, file, cb) {
  if (!validMimes.includes(file.mimetype)) {
    return cb(new ValidationError('Only images are allowed'), false);
  }

  return cb(null, true);
}

const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
});

module.exports = {
  uploadImage,
};
