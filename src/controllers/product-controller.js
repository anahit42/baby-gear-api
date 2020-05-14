const { ProductModel } = require('../models');

const createProduct = async (req,res,next)=> {
  try {
    const productBody = req.body;
    const product = await ProductModel.create(productBody);
    return res.status(200).json(product);
  }catch (error) {
    next(error);
  }
};
const updateProduct = async (req,res,next)=> {
  try {
    const { id } = req.params;
    const _id = { _id: id };
    const updateFields = req.body;

    // await ProductModel.findOne( _id, async (err, product) => {
    //   Object.keys(updateFields).map( update => {
    //     const value = updateFields[update];
    //     if(Array.isArray(value)){
    //       value.map(item=>{
    //         if( product[update].indexOf(item) === -1 ) product[update].push(item);
    //       });
    //     }else if( typeof value === 'object' ){
    //       product[update] = Object.assign(product[update], value);
    //     }else{
    //       product[update] = value;
    //     }
    //   });
    //   await product.save();
    //   return res.status(200).json(product);
    // });

    const product = await ProductModel.findOne( _id);
    Object.keys(updateFields).map( update => {
      const value = updateFields[update];
      if(Array.isArray(value)){
        value.map(item=>{
          if( product[update].indexOf(item) === -1 ) product[update].push(item);
        });
      }else if( typeof value === 'object' ){
        product[update] = Object.assign(product[update], value);
      }else{
        product[update] = value;
      }
    });
    await ProductModel.updateOne(_id,product);
    return res.status(200).json(product);
  }catch (error) {
    next(error);
  }
};
module.exports = {
  createProduct,
  updateProduct
};
