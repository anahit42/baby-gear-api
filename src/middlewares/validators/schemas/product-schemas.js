const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const {  string, number, array, date } = Joi.types();

const productsCreateSchema = Joi.object({
  body: Joi.object({
    name: string.trim().max(200).required(),
    description: string.trim().required(),
    price: string.trim().required(),
    properties:Joi.object({
      color:string.trim().required(),
      size:string.trim().required(),
      weight:string.trim(),
      ageFrom:number.integer().required(),
      ageTo:number.integer().required(),
    }).required(),
    customProperties:Joi.object(),
    condition:string.valid('new', 'very good','good', 'acceptable').trim().max(15).required(),
    status: string.valid('active', 'deleted', 'not-available').trim().max(20).required(),
    quantity:number.integer().required(),
    brand: string.trim(),
    country: string.trim(),
    images: array.items(string.trim()),
    issueDate: date.greater('1-1-1974').prefs({ convert: true }),
    subCategories:Joi.objectId()
  })
});

module.exports = {
  productsCreateSchema
};

