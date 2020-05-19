const { OrderModel } = require('../models');

async function getOrders(req, res, next){
  const { limit, skip } = req.query;
  const userId = req.userData._id;

  try{
    const orders = await OrderModel.findOne({
      ownerId: userId
    }).limit(limit).skip(skip) || [];

    return res.status(200).json({ orders }); 
  }
  catch(error){
    return next(error);
  }
}

module.exports = {
  getOrders
};
