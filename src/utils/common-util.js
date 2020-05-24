class CommonUtil {
  static formatUpdateSubDocument(propertyValue = {}, propertyKey) {
    return Object.keys(propertyValue).reduce((updatedObject, key) => {
      updatedObject[`${propertyKey}.${key}`] = propertyValue[key];
      return updatedObject;
    }, {});
  }

  static removeObjectUndefinedValue(object) {
    Object.keys(object).forEach((key) => object[key] === undefined && delete object[key]);
    return object;
  }
}

module.exports = CommonUtil;
