const { PaymentMethodModel } = require('../models');
const { NotFoundError } = require('../errors')

async function getUserPaymentMethod(paymentMethodId) {
    try {

        //const { paymentMethodId } = req.body
        //const userId = req.userData._id;

        if (paymentMethodId) {
            let paymentMethod = await PaymentMethodModel.findOne({ _id: paymentMethodId });
            return paymentMethod
        }
        else {
            paymentMethod = await PaymentMethodModel.findOne({ userId: userId }).where({ 'default': 'true' })
            if (!paymentMethod) {
                throw new NotFoundError('Default payment method not found, please provide payment method');
            }
            return paymentMethod
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getUserPaymentMethod
}