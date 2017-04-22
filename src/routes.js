import _ from 'lodash'
import JsonApiHelper from './json-api-helper'

export function generateRoutes(model) {
  const apiHelper = new JsonApiHelper(model.getTableName())
  return {
    getAll: function getAllResources(req, res, next) {
      return model.findAll()
        .then((resources) => {
          res.send(apiHelper.serialize(resources))
          return next()
        })
    },

    get: function getResource(req, res, next) {
      return model.findById(req.params.id)
        .then((resource) => {
          res.send(apiHelper.serialize(resource))
          return next()
        })
    },

    create: function createResource(req, res, next) {
      const resource = apiHelper.deserialize(JSON.parse(req.body.toString('utf8')))
      return model.findOrCreate({ where: resource, default: resource })
        .spread(function(newResource, created) {
          if (created) {
            res.send(200, apiHelper.serialize(newResource))
          } else {
            res.send(201, apiHelper.serialize(newResource))
          }
          return next()
        })
    }
  }
}
