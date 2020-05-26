const { PaymentMethodModel, UserModel } = require('../models');
const { ResponseHandlerUtil } = require('../utils');

const StripeLib = require('../libs/stripe-lib');

async function createPaymentMethod(req, res, next) {
  try {
    const { card, type, defaultMethod } = req.body;
    const userId = req.userData._id;

    const user = await UserModel.findOne({ _id: userId });

    if (!user.paymentCustomerId) {
      const customer = await StripeLib.createCustomer({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.mobilePhone,
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
      },
    });

    const methodId = paymentMethod.id;

    if (defaultMethod) {
      await StripeLib.setPaymentMethodAsDefault({ methodId, customerId });
    }

    const paymentMethodDoc = await PaymentMethodModel.create({
      userId,
      methodId,
      methodType: type,
      default: defaultMethod,
    });

    return ResponseHandlerUtil.handleCreate(res, { paymentMethod: paymentMethodDoc });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPaymentMethod,
};
