const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var debug = require('debug')('Database');

debug('database connection state: ' + mongoose.connection.readyState)

module.exports = mongoose