const multer = require('multer');

const ValidationError = require('../errors/validation-error');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExt = ['jpeg', 'jpg', 'png', 'gif'];
    if (allowedExt.every(ext => !file.mimetype.includes(ext))) {
      return cb(new ValidationError('Only images are allowed'));
    }
    cb(null, true);
  }
});

module.exports = upload;
