const config = require('config');

const { Client } = require('@elastic/elasticsearch');
const { SearchError } = require('../errors');

const { password, username, host, productsIndex } = config.get('elasticSearch');

class ElasticSearchLib {
  constructor() {
    this.client = new Client({
      node: host,
      auth: { username, password },
    });
  }

  async searchProduct(query) {
    try {
      const data = await this.client.search({
        index: productsIndex,
        body: {
          query: {
            match: {
              name: query,
            },
          },
        },
      });

      return {
        data: data.body.hits.hits,
        total: data.body.hits.total.value,
      };
    } catch (error) {
      throw new SearchError(error.message, error.statusCode);
    }
  }

  async dropProductsIndex() {
    try {
      return await this.client.indices.delete({
        index: productsIndex,
      });
    } catch (error) {
      throw new SearchError(error.message, error.statusCode);
    }
  }

  async createProductsIndex() {
    try {
      return await this.client.indices.create({
        index: productsIndex,
        body: {
          mappings: {
            properties: {
              id: { type: 'text', index: false },
              name: { type: 'text' },
              images: { type: 'text', index: false },
            },
          },
        },
      });
    } catch (error) {
      throw new SearchError(error.message, error.statusCode);
    }
  }

  async indexProduct(data) {
    try {
      return await this.client.create({
        id: data.id,
        index: productsIndex,
        body: data,
      });
    } catch (error) {
      throw new SearchError(error.message, error.statusCode);
    }
  }
}

module.exports = new ElasticSearchLib();
