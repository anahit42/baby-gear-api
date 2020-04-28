const express = require('express');
const router = express.Router();

const { createUser, getUser } = require('../controllers/user-controller');

router.get('/', () => {});

router.post('/', createUser);

router.get('/:userId', getUser);

module.exports = router;
