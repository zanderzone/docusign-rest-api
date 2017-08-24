var getLogPath = function(logPath) {
  if (logPath.substring(0,1) == "~") {
    var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    logPath = home + logPath.substring(1, logPath.length);
  }
  return logPath;
};

// NOTE: use this script to create an nconf compatible settings file.  It will create (or overwrite/update) a file called nconf.json in the same folder as this script.
var fs        = require('fs'),
    nconf     = require('nconf'),
    path      = require('path'),
    pkg       = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    nconf.argv().env();

//load user settings first, if file exists
var userFile = path.join(__dirname, 'settings-user.json');
if (fs.existsSync(userFile)) {
  console.log('user settings:', userFile);
  nconf.add('user', { type: 'file', file: userFile });  
}

//determine which settings file to apply
var key = "development"; // "development" is the default if an environment is not determined to have been supplied

//priority 1: was an argument passed while starting up node?  e.g. node server.js staging
if (process.argv[2]) {
  key = process.argv[2].toLowerCase();
}
//priority 2: match on "env" in user-settings.js
else if (nconf.get('env')) {
  key = nconf.get('env');
}
//priority 3: match on "env" in package.json
else if (pkg.env) {
  key = pkg.env.toLowerCase();
}

console.log('using settings key: ', key);

var settingsFile = path.join(__dirname, 'settings-' + key + '.json');
if (!fs.existsSync(settingsFile)) {
  console.error('NO GLOBAL SETTINGS FILE NOT FOUND');
}
else {
  console.log('global settings:', settingsFile);
  nconf.add('global', { type: 'file', file: settingsFile });
}

var settings = {
  env         : key,
  version     : pkg.version,
  path        : nconf.get('path'),
  port        : process.env.VCAP_APP_PORT || nconf.get('port'),
  serverName  : 'docusign-api',
  logging     : {
    console   : nconf.get('logging:console'),
    file      : nconf.get('logging:file'),
    path      : getLogPath(nconf.get('logging:path'))
  }
};

console.log(JSON.stringify(settings));

process.env.NODE_ENV = settings.env;

module.exports = settings;