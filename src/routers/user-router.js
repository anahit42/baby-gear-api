const express = require('express');
const router = express.Router();

const { getUser, getUserProducts } = require('../controllers/user-controller');

router.get('/:userId', getUser);
router.get('/:userId/products', getUserProducts);

module.exports = router;
