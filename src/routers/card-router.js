const express = require('express');

const router = express.Router();


const { createCard } = require('../controllers/card-controller');

router.post('/', createCard);

module.exports = router;
