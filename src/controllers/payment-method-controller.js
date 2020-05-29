const { PaymentMethodModel, UserModel } = require('../models');
const { ResponseHandlerUtil } = require('../utils');
const { NotFoundError, ConflictError } = require('../errors');

const StripeLib = require('../libs/stripe-lib');

async function createPaymentMethod(req, res, next) {
  try {
    const { card, type, shipping } = req.body;
    const userId = req.userData._id;
    let { isDefaultMethod } = req.body;

    const user = await UserModel.findOne({ _id: userId });

    if (!user.paymentCustomerId) {
      const customer = await StripeLib.createCustomer({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.mobilePhone,
        taxExempt: 'exempt',
        shipping,
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
          country: user.address.country,
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

    const paymentMethodDoc = await PaymentMethodModel.findOne({ _id: paymentMethodId, userId });

    if (!paymentMethodDoc) {
      throw new NotFoundError(`The payment method with id = ${paymentMethodId} not found.`);
    }

    const { isDefault, methodId } = paymentMethodDoc;

    if (isDefaultMethod === isDefault) {
      throw new ConflictError('You can set to default only not default method.');
    }

    if (!isDefaultMethod) {
      const otherDefaultMethod = await PaymentMethodModel.exists({ userId, isDefault: true });

      if (!otherDefaultMethod) {
        throw new ConflictError('You need to have at leas one default payment method..');
      }
    } else {
      await PaymentMethodModel.updateMany({ userId, isDefault: true }, { isDefault: false });
    }

    paymentMethodDoc.isDefault = isDefault;
    paymentMethodDoc.billingDetails = billingDetails;
    await paymentMethodDoc.save();

    const { paymentCustomerId } = await UserModel.findOne({ _id: userId });

    await StripeLib.updatePaymentMethod({
      methodId,
      billingDetails,
      isDefaultMethod,
      customerId: paymentCustomerId
    });

    return ResponseHandlerUtil.handleCreate(res, paymentMethodDoc);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPaymentMethod,
  updateUserPaymentMethod,
};
