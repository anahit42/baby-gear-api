const { OrderModel } = require('../models');
const { NotfoundError } = require('../errors');

async function getOrder(req, res, next) {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findOne({ _id: orderId });

    if (!order) {
      throw new NotfoundError('Item not found');
    }

    return res.status(200).json({ data: order });
  } catch (error) {
    return next(error);
  }
}

async function getOrders(req, res, next) {
  const { limit, skip } = req.query;
  const userId = req.userData._id;

  try {
    const orders = await OrderModel.find({ ownerId: userId }).limit(limit).skip(skip);

    return res.status(200).json({ data: orders });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrder,
  getOrders,
};
