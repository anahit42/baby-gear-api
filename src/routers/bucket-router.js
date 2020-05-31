const express = require('express');

const router = express.Router();
const { validateUserId } = require('../middlewares/validators/user-validator');

const {
  getBucket,
  removeBucket,
} = require('../controllers/bucket-controller');


router.get('/:userId/bucket', validateUserId, getBucket);
router.delete('/:userId/bucket', validateUserId, removeBucket);

module.exports = router;
