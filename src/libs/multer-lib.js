const multer = require('multer');
const config = require('config');

const ValidationError = require('../errors/validation-error');

function imageFileFilter(req, file, cb) {
  const validMimes = config.get('image.validMimes');

  if(!validMimes.includes(file.mimetype)) {
    cb(new ValidationError('Only images are allowed'), false);
  }
  cb(null, true);
}

var storage = multer.memoryStorage();

const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter
});

module.exports = {
  uploadImage
};
