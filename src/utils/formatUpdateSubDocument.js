function formatUpdateSubDocument(propertyValue = {}, propertyKey) {
  return Object.keys(propertyValue).reduce((updatedObject, key) => {
    updatedObject[`${propertyKey}.${key}`] = propertyValue[key];
    return updatedObject;
  }, {});
}
module.exports = formatUpdateSubDocument;
