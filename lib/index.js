'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _restifyPlugins = require('restify-plugins');

var _restifyPlugins2 = _interopRequireDefault(_restifyPlugins);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _formatter = require('./formatter');

var _formatter2 = _interopRequireDefault(_formatter);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

var _jsonApiHelper = require('./json-api-helper');

var _jsonApiHelper2 = _interopRequireDefault(_jsonApiHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  name: 'JSON::API Server',
  version: '1.0.0',
  port: 8080,
  database: {
    name: 'database',
    username: null,
    password: null,
    host: 'localhost',
    dialect: 'sqlite',
    storage: './database.sqlite'
  }
};

var ApiServer = function () {
  function ApiServer(options) {
    _classCallCheck(this, ApiServer);

    this.options = Object.assign({}, defaultOptions, options);
    this.database = new _database2.default(this.options.database.name, this.options.database);
    this.resources = {};
    this.Sequelize = require('sequelize'); // eslint-disable-line global-require
  }

  _createClass(ApiServer, [{
    key: 'define',
    value: function define(resource) {
      var model = this.database.defineModel(resource.type, resource.attributes);
      var fieldsToOmit = _lodash2.default.keys(_lodash2.default.pickBy(resource.attributes, function (attribute) {
        return attribute.omit;
      }));
      var apiHelper = new _jsonApiHelper2.default(resource.type, 'sequelize', fieldsToOmit);
      this.resources[resource.type] = {
        model: model,
        routes: (0, _routes2.default)(model, apiHelper)
      };
    }
  }, {
    key: 'start',
    value: function start() {
      var server = _restify2.default.createServer({
        name: this.options.name,
        version: this.options.version,
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

      _lodash2.default.forOwn(this.resources, function (value, key) {
        value.model.sync({ force: true });
        server.get('/' + key, value.routes.getAll);
        server.get('/' + key + '/:id', value.routes.get);
        server.post('/' + key, value.routes.create);
        server.patch('/' + key + '/:id', value.routes.update);
        server.del('/' + key + '/:id', value.routes.delete);
      });

      server.listen(this.options.port, function () {
        console.log('%s listening at %s', server.name, server.url);
      });
    }
  }]);

  return ApiServer;
}();

exports.default = ApiServer;