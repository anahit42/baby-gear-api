const Stripe = require('stripe');

const config = require('config');
const { PaymentError } = require('../errors');

const secretKey = config.get('stripe.secretKey');

class StripeLib {
  constructor() {
    this.stripe = new Stripe(secretKey, { apiVersion: '2020-03-02' });
  }

  /**
   * @param { Object } payload
   * @param { string } payload.email
   * @param { string } payload.name
   * @param { string } payload.phone
   */
  async createCustomer(payload) {
    try {
      const { email, name, phone } = payload;
      return await this.stripe.customers.create({ email, name, phone });
    } catch (error) {
      throw new PaymentError(error.message, error.statusCode);
    }
  }

  /**
   * @param { Object } payload
   * @param { Object } payload.card
   * @param { Object } payload.billingDetails
   * @param { string } payload.type
   * @param { string } payload.customerId
   */
  async creteCard(payload) {
    try {
      const { card, billingDetails, type, customerId } = payload;
      const createdCard = await this.stripe.paymentMethods.create({
        card,
        type,
        billing_details: billingDetails,
      });

      await this.stripe.paymentMethods.attach(createdCard.id, { customer: customerId });

      return createdCard;
    } catch (error) {
      throw new PaymentError(error.message, error.statusCode);
    }
  }

  /**
   * @param { Object } payload
   * @param { string } payload.customerId
   * @param { string } payload.cardId
   */
  async setCardAsDefault(payload) {
    try {
      const { customerId, cardId } = payload;
      const updateData = {
        invoice_settings: { default_payment_method: cardId },
      };

      return await this.stripe.customers.update(customerId, updateData);
    } catch (error) {
      throw new PaymentError(error.message, error.statusCode);
    }
  }
}

module.exports = new StripeLib();
