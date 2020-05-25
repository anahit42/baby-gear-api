const Stripe = require('stripe');

const config = require('config');

const secretKey = config.get('stripe.secretKey');

class StripeLib {
  constructor() {
    this.stripe = new Stripe(secretKey, { apiVersion: '2020-03-02' });
  }

  async createCustomer(payload) {
    const { email, name, phone } = payload;
    return this.stripe.customers.create({ email, name, phone });
  }

  async creteCard(payload) {
    const { card, type, billingDetails } = payload;
    return this.stripe.paymentMethods.create({ card, type, billing_details: billingDetails });
  }
}

module.exports = new StripeLib();
