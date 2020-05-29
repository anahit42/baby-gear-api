const agenda = require('./agenda');
const { updateInvoices } = require('./invoices');

agenda.define('update invoices', updateInvoices);

async function start() {
  await agenda.start();
  agenda.every('1 hour', 'update invoices');
}

module.exports = {
  start,
};
