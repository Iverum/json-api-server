import _ from 'lodash'
import Errors from 'restify-errors'
import sequelize from 'sequelize'
import JsonApiHelper from './json-api-helper'

export default function generateRoutes(model) {
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
          if (_.isEmpty(resource)) {
            return next(new Errors.NotFoundError())
          }
          res.send(apiHelper.serialize(resource))
          return next()
        })
    },

    create: function createResource(req, res, next) {
      const resource = apiHelper.deserialize(JSON.parse(req.body.toString('utf8')))
      return model.findOrCreate({ where: resource, default: resource })
        .spread((newResource, created) => {
          if (created) {
            res.send(200, apiHelper.serialize(newResource))
          } else {
            res.send(201, apiHelper.serialize(newResource))
          }
          return next()
        })
        .catch(sequelize.ValidationError, (error) => {
          const detail = _.reduce(error.errors, (msg, err) => `${msg}${err.path}: ${err.message}\n`, '')
          res.send(400, {
            errors: [{
              status: '400',
              title: 'Bad Request',
              detail
            }]
          })
        })
    },

    update: function updateResource(req, res, next) {
      const bodyJson = JSON.parse(req.body.toString('utf8'))
      const attributesToUpdate = _.get(bodyJson, 'data.attributes', {})
      const updates = apiHelper.deserialize(bodyJson)
      return model.update(updates, {
        where: { id: updates.id },
        fields: _.keys(attributesToUpdate)
      })
        .spread((rowsUpdated) => {
          if (!rowsUpdated || rowsUpdated < 1) {
            throw Error('Could not update resource')
          }
          return model.findById(updates.id)
        }).then((resource) => {
          res.send(200, apiHelper.serialize(resource))
          return next()
        })
    },

    delete: function deleteResource(req, res, next) {
      return model.destroy({ where: { id: req.params.id } })
        .then((numberDestroyed) => {
          if (numberDestroyed === 1) {
            res.send(204)
            return next()
          }
          throw Error('Could not delete resource')
        })
    }
  }
}
