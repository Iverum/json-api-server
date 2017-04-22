import _ from 'lodash'
import JsonApiHelper from './json-api-helper'

export function generateRoutes(model) {
  const apiHelper = new JsonApiHelper(model.getTableName())
  console.log(apiHelper)
  return {
    get: function getResource(req, res, next) {
      return model.findAll()
        .then((response) => {
          res.send(apiHelper.serialize(response))
          return next()
        })
    },

    create: function createResource(req, res, next) {
      const resource = apiHelper.deserialize(JSON.parse(req.body.toString('utf8')))
      return model.findOrCreate({ where: resource, default: resource })
        .spread(function(user, created) {
          if (created) {
            res.send(200, apiHelper.serialize(user))
          } else {
            res.send(201, apiHelper.serialize(user))
          }
          return next()
        })
    }
  }
}
