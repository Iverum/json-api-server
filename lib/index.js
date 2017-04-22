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

var _routes2 = _interopRequireDefault(_routes);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var database = new _database2.default('database', { storage: './database.sqlite' });
var resources = {};

var apiServer = {
  Sequelize: _sequelize2.default,
  define: function define(resource) {
    var model = database.defineModel(resource.type, resource.attributes);
    resources[resource.type] = {
      model: model,
      routes: (0, _routes2.default)(model)
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
          if (body instanceof Error) {
            console.log('ERROR', body);
            res.status(500);
            return cb(null, JSON.stringify({
              errors: [{
                status: '500',
                title: 'Internal Server Error',
                detail: body.message
              }]
            }));
          }
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
    server.use(_restifyPlugins2.default.jsonBodyParser());

    _lodash2.default.forOwn(resources, function (value, key) {
      value.model.sync({ force: true });
      server.get('/' + key, value.routes.getAll);
      server.get('/' + key + '/:id', value.routes.get);
      server.post('/' + key, value.routes.create);
      server.patch('/' + key + '/:id', value.routes.update);
      server.del('/' + key + '/:id', value.routes.delete);
    });

    server.listen(8080, function () {
      console.log('%s listening at %s', server.name, server.url);
    });
  }
};
exports.default = apiServer;