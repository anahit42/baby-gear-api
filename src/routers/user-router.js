const express = require('express');
const router = express.Router();

const { validateCreateUser } = require('../middlewares/validators/user-validator');
const { createUser, getUser } = require('../controllers/user-controller');

router.post('/', validateCreateUser, createUser);

router.get('/:userId', getUser);

module.exports = router;
