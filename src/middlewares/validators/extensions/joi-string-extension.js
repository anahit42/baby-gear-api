const Joi = require('@hapi/joi');
const countries = require('i18n-iso-countries');

const JoiStringExtension = Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.phoneNumber': '"{{#label}}" is not valid phone number',
    'string.countryCode': '"{{#label}}" is not valid country code',
  },
  rules: {
    phoneNumber: {
      validate(value, helpers) {
        const regexPattern = new RegExp('^[0-9-]+$');

        if (!regexPattern.test(value)) {
          return helpers.error('string.phoneNumber');
        }

        return value;
      },
    },
    countryCode: {
      validate(value, helpers) {
        if (!countries.isValid(value)) {
          return helpers.error('string.countryCode');
        }

        return value;
      },
    },
  },
}));

module.exports = JoiStringExtension;
