/* eslint-disable no-unused-vars */
const { OrderModel } = require('../models');

async function getOrder(req, res, next){
  const { orderId } = req.params;
  try{
    return res.status(200).json({
      orders: await OrderModel.findOne({
        _id: orderId
      })
    }); 
  }
  catch(error){
    next(error);
  }
}

module.exports = {
  getOrder
};
