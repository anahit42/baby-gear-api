const fieldNames = ['limit', 'skip'];

class QueryParserMiddleware {
  static parseNumbers(req, res, next) {
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

module.exports = QueryParserMiddleware;
