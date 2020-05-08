const mongoose = require('mongoose');

const { FavoritesSchema } = require('./schemas');

const FavoritesModel = mongoose.model('Favorites', FavoritesSchema);

module.exports = FavoritesModel;
