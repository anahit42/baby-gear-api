const { PaymentMethodModel } = require('../models');
const { NotFoundError } = require('../errors');

async function getUserPaymentMethod(req) {
    try {
        const { paymentMethodId } = req.body;
        const userId = req.userData._id;

        if (paymentMethodId) {
            const paymentMethod = await PaymentMethodModel.findOne({ _id: paymentMethodId });
            return paymentMethod;
        }
        

        const paymentMethod = await PaymentMethodModel.findOne({ userId }).where({ default: 'true' });
        if (!paymentMethod) {
            throw new NotFoundError('Default payment method not found, please provide payment method');
        }
        return paymentMethod;
    } catch (error) {
        throw new Error();
    }
}

module.exports = {
    getUserPaymentMethod,
};
