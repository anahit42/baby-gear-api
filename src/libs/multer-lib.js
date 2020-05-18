const multer = require('multer');
const config = require('config');

const ValidationError = require('../errors/validation-error');

function imageFileFilter(req, file, cb) {
  const validMimes = config.get('image.validMimes');

  if(!validMimes.includes(file.mimetype)) {
    return cb(new ValidationError('Only images are allowed'), false);
  }

  return cb(null, true);
}

const storage = multer.memoryStorage();

const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter
});

module.exports = {
  uploadImage
};
