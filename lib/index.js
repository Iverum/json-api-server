'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _restifyPlugins = require('restify-plugins');

var _restifyPlugins2 = _interopRequireDefault(_restifyPlugins);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _routes = require('./routes');

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var database = new _database2.default('database', { storage: './database.sqlite' });
var resources = {};

var apiServer = {
  define: function define(resource) {
    var model = database.defineModel(resource.type, resource.attributes);
    resources[resource.type] = {
      model: model,
      routes: (0, _routes.generateRoutes)(model)
    };
  },

  start: function start() {
    function sendUnsupportedType(req, res) {
      res.send(415);
    }

    var server = _restify2.default.createServer({
      name: 'JSON::API Server',
      version: '1.0.0',
      formatters: {
        'application/vnd.api+json': function handleJsonApi(req, res, body, cb) {
          res.setHeader('content-type', 'application/vnd.api+json');
          var data = body ? JSON.stringify(body) : 'null';
          return cb(null, data);
        },
        'application/javascript': sendUnsupportedType,
        'application/json': sendUnsupportedType,
        'application/octet-stream': sendUnsupportedType,
        'text/plain': sendUnsupportedType
      }
    });
    server.use(_restifyPlugins2.default.acceptParser(['application/vnd.api+json']));

    _lodash2.default.forOwn(resources, function mapResources(value, key) {
      value.model.sync({ force: true });
      server.get('/' + key, value.routes.get);
    });

    server.listen(8080, function () {
      console.log('%s listening at %s', server.name, server.url);
    });
  }
};

exports.default = apiServer;


apiServer.define({
  type: 'users',
  attributes: {
    firstName: { type: _sequelize2.default.STRING },
    lastName: { type: _sequelize2.default.STRING }
  }
});
apiServer.start();