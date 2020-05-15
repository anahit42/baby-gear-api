const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');

const HttpStatus = require('http-status-codes');

const mongodb = require('./storages/mongodb');
mongodb.init();

const AuthMiddleware = require('./middlewares/auth-middleware');

const apiPort = config.get('api.port');

const { NotFoundError } = require('./errors');

const app = express();

const { authRouter, userRouter } = require('./routers');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', authRouter);

app.use(AuthMiddleware.authorize);
app.use('/users', userRouter);

const multer = require('multer');
app.use(multer({
  dest: 'uploads/'
}).single('file'));

app.use((req, res, next) => {
  return next(new NotFoundError(HttpStatus.NOT_FOUND));
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
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      status: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'The server encountered an internal error. Try again later.'
  });
});

app.listen(apiPort);
