const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = CardSchema;
