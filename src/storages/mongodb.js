const config = require('config');
const mongoose = require('mongoose');

const connection = config.get('db.connection');
const options = config.get('db.options');

function init() {
  mongoose.connect(connection, options);

  mongoose.connection.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('error', error);
  });

  mongoose.connection.on('open', () => {
    // eslint-disable-next-line no-console
    console.log('connection opened');
  });
}

module.exports = {
  init,
};
