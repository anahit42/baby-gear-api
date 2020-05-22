const fieldNames = ['limit', 'skip'];

class QueryMiddleware {
  static parseQueryNumbers(req, res, next) {
    if (req.query) {
      fieldNames.forEach((fieldName) => {
        if (req.query[fieldName]) {
          req.query[fieldName] = Number(req.query[fieldName]);
        }
      });
    }

    return next();
  }
}

module.exports = QueryMiddleware;