var path      = require('path'), 
    settings  = require('./settings'); 

module.exports = function (server, Restify) {
  // server.use(Restify.plugins.CORS());
  server.use(Restify.plugins.acceptParser(server.acceptable));
  server.use(Restify.plugins.dateParser());
  server.use(Restify.plugins.queryParser());
  server.use(Restify.plugins.gzipResponse());
  server.use(Restify.plugins.bodyParser());
};