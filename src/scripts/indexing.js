const dotenv = require('dotenv');

dotenv.config();

const Promise = require('bluebird');
const mongodb = require('../storages/mongodb');

mongodb.init();

const ElasticSearchLib = require('../libs/elastic-search-lib');
const ProductsModel = require('../models/product-model');

async function start() {
  await ElasticSearchLib.dropProductsIndex();
  await ElasticSearchLib.createProductsIndex();

  const products = await ProductsModel.find();
  await Promise.map(products, (product) => {
    const { _id, name, images } = product;
    return ElasticSearchLib.indexProduct({
      id: _id.toString(),
      name,
      images,
    });
  }, { concurrency: 10 });
}

setTimeout(() => {
  start()
    .then(() => process.exit())
    // eslint-disable-next-line no-console
    .catch((error) => console.error(error));
}, 1000);
