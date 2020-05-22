function removeObjectUndefinedValue(object) {
  Object.keys(object).forEach(key => object[key] === undefined && delete object[key]);
  return object;
}

module.exports = removeObjectUndefinedValue;

