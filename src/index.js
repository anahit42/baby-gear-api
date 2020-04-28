const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./storages/mongodb');
mongodb.init();

const app = express();

const { authRouter, userRouter } = require('./routers');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.listen(3000);
