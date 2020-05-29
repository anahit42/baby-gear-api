const agenda = require('./agenda');
const { updateInvoices } = require('./invoices');

async function start() {
  agenda.define('update invoices', updateInvoices);

  await agenda.start();
  await agenda.every('1 hour', 'update invoices');
}

module.exports = {
  start,
};
