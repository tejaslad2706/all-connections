'use strict';
const config = require("../config");
const Mongoconfig = config.mongo;
const Promise = require("bluebird")
let { MongoClient } = require('mongodb');
MongoClient = Promise.promisifyAll(MongoClient);

function createDBUrl(options){
    let connectionString = 'mongodb://';
    
    if (options.authEnabled === true) {
        credentials = encodeURIComponent(options.userName || Mongoconfig.userName) + ":" + encodeURIComponent(options.password || Mongoconfig.password) + "@";
        connectionString += credentials;
    }
    connectionString += options.host || Mongoconfig.host;
    connectionString += ':';
    connectionString += options.port || Mongoconfig.port;
    connectionString += '/';
    if (options.database) {
        connectionString += options.database;
    }
    return connectionString;
}


module.exports = function(configurations,cb){
    let url = createDBUrl(configurations);
    let options = {}
    options = Object.assign({autoReconnect: true, reconnectTries: Number.MAX_SAFE_INTEGER, reconnectInterval: Mongoconfig.reconnectInterval}, options);
    // return new Promise((resolve,reject)=>{
      MongoClient.connectAsync(url, options, (error, client) => {
      if (error) {
        debug('error connecting to MongoDB.');
        cb(error,null);
      }
      cb(null,client);    
    })
  // });
}