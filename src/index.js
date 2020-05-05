const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');

const mongodb = require('./storages/mongodb');
mongodb.init();

const apiPort = config.get('api.port');

const { NotFoundError } = require('./errors');

const app = express();

const { authRouter, userRouter } = require('./routers');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use((req, res, next) => {
  return next(new NotFoundError('Path not found.'));
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.customError) {
    return res.status(error.status).json({
      success: false,
      status: error.status,
      message: error.message
    });
  }

  if (error.name === 'SyntaxError') {
    return res.status(error.status).json({
      success: false,
      status: 400,
      message: error.message
    });
  }

  return res.status(error.status).json({
    success: false,
    status: 500,
    message: 'The server encountered an internal error. Try again later.'
  });
});

app.listen(apiPort);
