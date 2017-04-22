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
  return {
    getAll: function getAllResources(req, res, next) {
      return model.findAll().then(function (resources) {
        res.send(apiHelper.serialize(resources));
        return next();
      });
    },

    get: function getResource(req, res, next) {
      return model.findById(req.params.id).then(function (resource) {
        res.send(apiHelper.serialize(resource));
        return next();
      });
    },

    create: function createResource(req, res, next) {
      var resource = apiHelper.deserialize(JSON.parse(req.body.toString('utf8')));
      return model.findOrCreate({ where: resource, default: resource }).spread(function (newResource, created) {
        if (created) {
          res.send(200, apiHelper.serialize(newResource));
        } else {
          res.send(201, apiHelper.serialize(newResource));
        }
        return next();
      });
    }
  };
}