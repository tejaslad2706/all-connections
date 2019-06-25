/**
 * @module config
 * exports a configuration object with all required configurations
 * configuration schemas are loaded from ./configs
 * if ./OverrrideConfig.json exists, it will be used to override default values
 */

const convict = require("convict");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");

/**
 * noop for convict formatter
 * if no formatting is needed for a format type
 */
function noop () { }

/**
 * resolve relative path to absolute path from brain dir in jiochatbot
 * @param {String} relativePath
 * @returns {String} absolute path
 */
function pathLoader (relativePath) {
  return path.join(__dirname, "..", relativePath);
}

/**
 * create RegExp from string
 */
function regexCompiler (regexString) {
  return new RegExp(regexString);
}

function loadConfigurations () {
  let config = {};
  const files = fs.readdirSync(path.resolve(__dirname, "./configs"));
  _.forEach(files, file => {
    if (file.indexOf(".json") === -1) return;
    config[_.chain(file).split(".").first().value()] = require(path.resolve(__dirname, "./configs/" + file));
  });
  return config;
}

convict.addFormat("path", noop, pathLoader);
convict.addFormat("regex", noop, regexCompiler);

var conf = convict(loadConfigurations());
var configfile = conf.get("app.configfile");

if (fs.existsSync(__dirname + configfile)) {
  conf.loadFile(__dirname + configfile);
  console.info("AllConnections: config loaded from %s", __dirname + configfile);
} else {
  console.info("AllConnections: no config file found at %s", __dirname + configfile);
}

// no clustering on windows (bug in nodejs cluster module on windows)
if (process.platform === "win32") { conf.set("app.noCluster", true); }

if (conf.get("app.cluster") === false) {
  conf.set("app.workerCount", 0);
}

conf.validate();

var _conf = conf._instance;

if ("get" in _conf) throw new Error("Do not set config.get");
_conf.get = conf.get.bind(conf);

module.exports = _conf;
