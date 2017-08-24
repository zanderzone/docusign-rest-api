var settings    = require('../../config/settings'),
    environment = require('../../config/environment'),
    routes      = require('../../config/routes'),
    moment      = require('moment'),
    path        = require('path'),
    fs          = require('fs')
    bunyan      = require('bunyan');

Restify = require('restify');

exports.startServer = function() {
  console.log('setup done');
  //setup logging
  var logPath = settings.logging.path;
	var logDate = new moment().format('YYYY-MM-DD-HHmm');
	var logFilespec = path.join(logPath, "docusign-rest-api-" + logDate + ".log");
	console.log(logFilespec);
	if (!fs.existsSync(logPath)) {
		console.log('creating logPath directory: ' + logPath);
		fs.mkdirSync(logPath);
	}

	var log = bunyan.createLogger({
	  name: 'api.docusign-rest-api.local',
	  streams: [
	    {
	      level: (settings.logging.console || 'error'),
	      stream: process.stdout
	    },
	    {
	      level: (settings.logging.file || 'info'),
	      path: logFilespec  
	    }
	  ],
	  serializers: {
            req: bunyan.stdSerializers.req
        }
  });

  var server = Restify.createServer({ 
    name: settings.serverName
  });

  server.pre(function (req, res, next) {
    req.log.debug({ req: req }, 'REQUEST');
    next();
  });

  environment(server, Restify);
  routes(server);

  server.listen('8080', function() {
    console.log('%s has started', settings.serverName);
  });
};
