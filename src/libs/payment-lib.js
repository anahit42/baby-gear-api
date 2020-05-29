const { PaymentMethodModel } = require('../models');
const { NotFoundError, PaymentError } = require('../errors');

async function getUserPaymentMethod(payload) {
  try {
    const { paymentMethodId, userId } = payload;

    if (paymentMethodId) {
      return await PaymentMethodModel.findOne({ _id: paymentMethodId, userId });
    }

    const paymentMethod = await PaymentMethodModel.findOne({ userId, default: true });

    if (!paymentMethod) {
      throw new NotFoundError('Default payment method not found, please provide payment method');
    }

    return paymentMethod;
  } catch (error) {
    throw new PaymentError(error.message);
  }
}

module.exports = {
  getUserPaymentMethod,
};
