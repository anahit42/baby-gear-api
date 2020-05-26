const { CardModel, UserModel } = require('../models');
const { ResponseHandlerUtil } = require('../utils');

const StripeLib = require('../libs/stripe-lib');

async function createCard(req, res, next) {
  try {
    const { cvc, defaultCard, number, expMonth, expYear, type } = req.body;
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

    const card = await StripeLib.creteCard({
      card: {
        number,
        cvc,
        exp_month: expMonth,
        exp_year: expYear,
      },
      billingDetails: {
        address: {
          line1: user.address.street,
          city: user.address.city,
          country: user.address.country,
          postal_code: user.address.zipCode,
        },
      },
      type,
      customerId,
    });
    const cardId = card.id;

    if (defaultCard) {
      await StripeLib.setCardAsDefault({ cardId, customerId });
    }

    const cardDoc = await CardModel.create({ userId, cardId });

    return ResponseHandlerUtil.handleCreate(res, { card: cardDoc });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCard,
};
