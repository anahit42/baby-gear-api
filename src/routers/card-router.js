const express = require('express');

const router = express.Router();

const { validateCreateCard } = require('../middlewares/validators/card-validator');
const { createCard } = require('../controllers/card-controller');

router.post('/', validateCreateCard, createCard);

module.exports = router;
