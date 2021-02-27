const mongoose = require('mongoose');

var dev_db_url = "mongodb://alfred:CUHxmrmy3uGI1G25@cluster0-shard-00-00.fcpxz.mongodb.net:27017,cluster0-shard-00-01.fcpxz.mongodb.net:27017,cluster0-shard-00-02.fcpxz.mongodb.net:27017/local_library?ssl=true&replicaSet=atlas-10n3od-shard-0&authSource=admin&retryWrites=true&w=majority"

var mongoDB = process.env.MONGO_URI || dev_db_url;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

var debug = require('debug')('database');

debug('database connection state: ' + mongoose.connection.readyState)

module.exports = mongoose