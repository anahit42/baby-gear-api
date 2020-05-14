const multer = require('multer');
const config = require('config');

function imageFileFilter(req, file, cb) {
  const validMimes = config.get('image.validMimes');

  if(!validMimes.includes(file.mimetype)) {
    cb(null, false);
  }

  cb(null, true);
}

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },

  filename: function (req, file, cb) {
    file.originalname = file.originalname.split(' ').join('_');

    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter
});

module.exports = {
  uploadImage
};