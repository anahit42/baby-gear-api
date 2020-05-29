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
  async createPaymentMethod(payload) {
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
   * @param { Object } payload.card
   * @param { Object } payload.billingDetails
   * @param { string } payload.type
   * @param { string } payload.customerId
   */
  async updatePaymentMethod(payload) {
    try {
      const { billingDetails, methodId } = payload;
      const updateData = {
        billing_details: billingDetails,
      };

      const createdCard = await this.stripe.paymentMethods.update(methodId, updateData);

      return createdCard;
    } catch (error) {
      throw new PaymentError(error.message, error.statusCode);
    }
  }

  /**
   * @param { Object } payload
   * @param { string } payload.customerId
   * @param { string } payload.methodId
   */
  async setPaymentMethodAsDefault(payload) {
    try {
      const { customerId, methodId } = payload;
      const updateData = {
        invoice_settings: { default_payment_method: methodId },
      };

      return await this.stripe.customers.update(customerId, updateData);
    } catch (error) {
      throw new PaymentError(error.message, error.statusCode);
    }
  }

  /**
   * @param { Object } payload
   * @param { string } payload.customerId
   * @param { string } payload.currency
   * @param { number } payload.amount
   * @param { string } payload.description
   * @param { Object } [payload.metadata]
   */
  async createInvoiceItem(payload) {
    try {
      const { customerId, currency, amount, description, metadata } = payload;
      return await this.stripe.invoiceItems.create({
        customer: customerId,
        currency,
        amount: amount * 100,
        description,
        metadata,
      });
    } catch (error) {
      throw new PaymentError(error.message, error.statusCode);
    }
  }

  /**
   * @param { Object } payload
   * @param { string } payload.customerId
   * @param { string } payload.description
   * @param { Object } [payload.metadata]
   */
  async createInvoice(payload) {
    try {
      const { customerId, description, metadata } = payload;
      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        collection_method: 'charge_automatically',
        auto_advance: true,
        description,
        metadata,
      });

      await this.stripe.invoices.finalizeInvoice(invoice.id);
      await this.stripe.invoices.pay(invoice.id);

      return invoice;
    } catch (error) {
      throw new PaymentError(error.message, error.statusCode);
    }
  }
}

module.exports = new StripeLib();
