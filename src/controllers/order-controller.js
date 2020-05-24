const { OrderModel } = require('../models');
const { NotfoundError } = require('../errors');
const { ResponseHandlerUtil } = require('../utils');

async function getOrder(req, res, next) {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findOne({ _id: orderId });

    if (!order) {
      throw new NotfoundError('Item not found');
    }

    return ResponseHandlerUtil.handleGet(res, order);
  } catch (error) {
    return next(error);
  }
}

async function getOrders(req, res, next) {
  const { limit, skip } = req.query;
  const userId = req.userData._id;

  try {
    const [orders, total] = await Promise.all(
      OrderModel.find({ ownerId: userId }).limit(limit).skip(skip),
      OrderModel.countDocuments({ ownerId: userId })
    );

    return ResponseHandlerUtil.handleList(res, orders, total);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrder,
  getOrders,
};
