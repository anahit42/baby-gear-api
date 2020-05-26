const dotenv = require('dotenv');

dotenv.config();

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');

const mongodb = require('./storages/mongodb');

mongodb.init();

const { AuthMiddleware, QueryParserMiddleware, ErrorHandlerMiddleware } = require('./middlewares');

const apiPort = config.get('api.port');

const app = express();

const {
  authRouter,
  categoryRouter,
  favoriteRouter,
  orderRouter,
  paymentMethodRouter,
  productRouter,
  userRouter,
} = require('./routers');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(QueryParserMiddleware.parseNumbers);

app.use('/auth', authRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

app.use(AuthMiddleware.authorize);
app.use('/favorites', favoriteRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);
app.use('/payment-methods', paymentMethodRouter);

app.use(ErrorHandlerMiddleware.handlePathNotFound);
app.use(ErrorHandlerMiddleware.handleError);

app.listen(apiPort);
