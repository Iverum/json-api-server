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

var _formatter = require('./formatter');

var _formatter2 = _interopRequireDefault(_formatter);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

var _jsonApiHelper = require('./json-api-helper');

var _jsonApiHelper2 = _interopRequireDefault(_jsonApiHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var database = new _database2.default('database', { storage: './database.sqlite' });
var resources = {};

var apiServer = {
  Sequelize: _sequelize2.default,
  define: function define(resource) {
    var model = database.defineModel(resource.type, resource.attributes);
    var fieldsToOmit = _lodash2.default.keys(_lodash2.default.pickBy(resource.attributes, function (attribute) {
      return attribute.omit;
    }));
    console.log(fieldsToOmit);
    var apiHelper = new _jsonApiHelper2.default(resource.type, 'sequelize', fieldsToOmit);
    resources[resource.type] = {
      model: model,
      routes: (0, _routes2.default)(model, apiHelper)
    };
  },

  start: function start() {
    var server = _restify2.default.createServer({
      name: 'JSON::API Server',
      version: '1.0.0',
      formatters: {
        'application/vnd.api+json': _formatter2.default,
        'application/javascript': _formatter.sendUnsupportedType,
        'application/json': _formatter.sendUnsupportedType,
        'application/octet-stream': _formatter.sendUnsupportedType,
        'text/plain': _formatter.sendUnsupportedType
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