const mongoose = require('mongoose');

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

function init() {
  mongoose.connect('mongodb://localhost/baby-gear', connectionOptions);

  mongoose.connection.on('error', (error) => {
    console.error('error', error);
  });

  mongoose.connection.on('open', () => {
    console.log('connection opened');
  });
}

module.exports = {
  init
};
