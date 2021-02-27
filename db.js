const mongoose = require('mongoose');

var mongoDB = process.env.MONGO_URI

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

var debug = require('debug')('database');

debug('database connection state: ' + mongoose.connection.readyState)

module.exports = mongoose