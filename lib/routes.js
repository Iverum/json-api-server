'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateRoutes;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restifyErrors = require('restify-errors');

var _restifyErrors2 = _interopRequireDefault(_restifyErrors);

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
        if (_lodash2.default.isEmpty(resource)) {
          return next(new _restifyErrors2.default.NotFoundError());
        }
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
    },

    update: function updateResource(req, res, next) {
      var bodyJson = JSON.parse(req.body.toString('utf8'));
      var attributesToUpdate = _lodash2.default.get(bodyJson, 'data.attributes', {});
      var updates = apiHelper.deserialize(bodyJson);
      return model.update(updates, {
        where: { id: updates.id },
        fields: _lodash2.default.keys(attributesToUpdate)
      }).spread(function (rowsUpdated) {
        if (!rowsUpdated || rowsUpdated < 1) {
          throw Error('Could not update resource');
        }
        return model.findById(updates.id);
      }).then(function (resource) {
        res.send(200, apiHelper.serialize(resource));
        return next();
      });
    },

    delete: function deleteResource(req, res, next) {
      return model.destroy({ where: { id: req.params.id } }).then(function (numberDestroyed) {
        if (numberDestroyed === 1) {
          res.send(204);
          return next();
        }
        throw Error('Could not delete resource');
      });
    }
  };
}