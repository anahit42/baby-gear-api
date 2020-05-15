/* eslint-disable no-unused-vars */
const { OrderModel } = require('../models');

async function getOrders(req, res, next){
  const { limit, offset } = req.query;
  try{
    return res.status(200).json({
      orders: await OrderModel.find().limit(limit * 1).skip(offset * 1).exec()
    }); 
  }
  catch(error){
    next(error);
  }
}

module.exports = {
  getOrders
};
