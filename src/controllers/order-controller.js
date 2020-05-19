const { OrderModel } = require('../models');
const NotfoundError = require('../errors/not-found-error');

async function getOrder(req, res, next)
{
  const { orderId } = req.params;
  try {
    const order = await OrderModel.findOne({
      _id: orderId
    });

    if (!order)
      return next(new NotfoundError('Item not found'));

    return res.status(200).json(order);
  }
  catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrder
};
