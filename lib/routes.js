'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRoutes = generateRoutes;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonApiHelper = require('./json-api-helper');

var _jsonApiHelper2 = _interopRequireDefault(_jsonApiHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateRoutes(model) {
  var apiHelper = new _jsonApiHelper2.default(model.getTableName());
  console.log(apiHelper);
  return {
    get: function getResource(req, res, next) {
      return model.findAll().then(function (response) {
        res.send(apiHelper.serialize(response));
        return next();
      });
    },

    create: function createResource(req, res, next) {
      var resource = apiHelper.deserialize(JSON.parse(req.body.toString('utf8')));
      return model.findOrCreate({ where: resource, default: resource }).spread(function (user, created) {
        if (created) {
          res.send(200, apiHelper.serialize(user));
        } else {
          res.send(201, apiHelper.serialize(user));
        }
        return next();
      });
    }
  };
}