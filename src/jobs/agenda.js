const Agenda = require('agenda');
const config = require('config');

const connection = config.get('db.connection');

const agenda = new Agenda({
  db: {
    address: connection,
    collection: 'agendaJob',
  },
});

module.exports = agenda;
