const Agenda = require('agenda');
const config = require('config');

const connection = config.get('db.connection');
const options = config.get('db.options');

const agenda = new Agenda({
  db: {
    address: connection,
    collection: 'agendaJob',
    options: {
      useNewUrlParser: options.useNewUrlParser,
      useUnifiedTopology: options.useUnifiedTopology,
    },
  },
});

module.exports = agenda;
