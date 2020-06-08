const Promise = require('bluebird');

const { OrderModel, UserModel } = require('../models');
const { ResponseHandlerUtil } = require('../utils');
const { ForbiddenError, ConflictError, NotFoundError } = require('../errors');

const OrderLib = require('../libs/order-lib');

async function getOrder(req, res, next) {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findOne({ _id: orderId });

    if (!order) {
      throw new NotFoundError('Item not found');
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

async function createOrder(req, res, next) {
  const { products, paymentMethodId } = req.body;
  const userId = req.userData._id;

  try {
    const user = await UserModel.findOne({ _id: userId }).select('paymentCustomerId');
    const { paymentCustomerId } = user;

    await OrderLib.createOrdersAndInvoiceItems({
      products,
      userId,
      paymentCustomerId,
    });

    const invoice = await OrderLib.createInvoice({
      paymentMethodId,
      paymentCustomerId,
      userId,
    });

    return ResponseHandlerUtil.handleCreate(res, invoice);
  } catch (error) {
    return next(error);
  }
}

async function createOrderComplaint(req, res, next) {
  const { orderId } = req.params;
  const { complaints } = req.body;
  const userId = req.userData._id;

  try {
    const order = await OrderModel.findOne({ _id: orderId, userId });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const { deliveryStatus } = order;

    if (!['shipped', 'delivered'].includes(deliveryStatus)) {
      throw new ConflictError('Order complaints can be created for shipped or delivered orders.');
    }

    order.complaints = complaints;
    await order.save();

    return ResponseHandlerUtil.handleGet(res, order);
  } catch (error) {
    return next(error);
  }
}

async function updateDeliveryStatus(req, res, next) {
  const { orderId } = req.params;
  const { deliveryStatus } = req.body;
  const userId = req.userData._id;

  try {
    const order = await OrderModel.findOne({ _id: orderId }).populate('productId');

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.productId.userId.toString() !== userId) {
      throw new ForbiddenError('Delivery status can be updated by product creator.');
    }

    order.deliveryStatus = deliveryStatus;
    await order.save();

    return ResponseHandlerUtil.handleUpdate(res, order);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrder,
  getOrders,
  createOrder,
  createOrderComplaint,
  updateDeliveryStatus,
};
