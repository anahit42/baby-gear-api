const { getCode } = require('country-list');
const { PaymentMethodModel, UserModel } = require('../models');
const { ResponseHandlerUtil } = require('../utils');
const NotFoundError = require('../errors/not-found-error');
const MethodNotAllowedError = require('../errors/method-not-allowed');

const StripeLib = require('../libs/stripe-lib');

async function createPaymentMethod(req, res, next) {
  try {
    const { card, type, shippingDetails } = req.body;
    let { isDefaultMethod } = req.body;
    const userId = req.userData._id;

    const user = await UserModel.findOne({ _id: userId });

    if (!user.paymentCustomerId) {
      const customer = await StripeLib.createCustomer({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.mobilePhone,
        tax_exempt: 'exempt',
        shipping: shippingDetails,
      });

      user.paymentCustomerId = customer.id;
      await user.save();
    }

    const customerId = user.paymentCustomerId;

    const paymentMethod = await StripeLib.createPaymentMethod({
      card,
      type,
      customerId,
      billingDetails: {
        address: {
          line1: user.address.street,
          city: user.address.city,
          country: getCode(user.address.country),
          postal_code: user.address.zipCode,
        },
        name: `${user.firstName} ${user.lastName}`,
        phone: user.mobilePhone,
        email: user.email,
      },
    });

    const methodId = paymentMethod.id;
    const hasDefaultCard = await PaymentMethodModel.exists({ userId, isDefault: true });

    if (isDefaultMethod && !hasDefaultCard) {
      await StripeLib.setPaymentMethodAsDefault({ methodId, customerId });
    } else {
      isDefaultMethod = false;
    }

    const paymentMethodDoc = await PaymentMethodModel.create({
      userId,
      methodId,
      methodType: type,
      isDefault: isDefaultMethod,
    });

    return ResponseHandlerUtil.handleCreate(res, { paymentMethod: paymentMethodDoc });
  } catch (error) {
    return next(error);
  }
}

async function updateUserPaymentMethod(req, res, next) {
  try {
    const { isDefaultMethod, billingDetails } = req.body;
    const { paymentMethodId } = req.params;
    const userId = req.userData._id;

    const paymentMethodDoc = await PaymentMethodModel.findOne({ _id: paymentMethodId });
    const { isDefault } = paymentMethodDoc;
    if (!paymentMethodDoc) {
      throw new NotFoundError(`The payment method with id = ${paymentMethodId} not found.`);
    }

    if (!isDefaultMethod || isDefault) {
      throw new MethodNotAllowedError('You can set to default only not default method.');
    }

    const inDbPaymentMethod = await PaymentMethodModel.findOneAndUpdate({
      _id: paymentMethodId }, { isDefault, billingDetails });
    const { methodId } = inDbPaymentMethod;
    await PaymentMethodModel.findOneAndUpdate({ userId, isDefault: isDefaultMethod }, { isDefault: false });

    await StripeLib.updatePaymentMethod({ methodId, billingDetails });

    const { paymentCustomerId } = await UserModel.findOne({ _id: userId });
    await StripeLib.setPaymentMethodAsDefault({ methodId, customerId: paymentCustomerId });

    return ResponseHandlerUtil.handleCreate(res, { paymentMethod: inDbPaymentMethod });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPaymentMethod,
  updateUserPaymentMethod,
};
