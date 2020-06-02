const dotenv = require('dotenv');

dotenv.config();

const Promise = require('bluebird');
const mongodb = require('../storages/mongodb');

mongodb.init();

const ElasticSearchLib = require('../libs/elastic-search-lib');

async function start() {
  // eslint-disable-next-line global-require
  const ProductsModel = require('../models/product-model');

  const products = await ProductsModel.find();
  await ElasticSearchLib.dropProductsIndex();
  await ElasticSearchLib.createProductsIndex();

  await Promise.map(products, (product) => {
    const { _id, name, images } = product;
    return ElasticSearchLib.indexProduct({
      id: _id.toString(),
      name,
      images,
    });
  });
}

setTimeout(() => {
  // eslint-disable-next-line no-console
  start().then(console.log).catch(console.error);
}, 1000);
