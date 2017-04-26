import restify from 'restify'
import plugins from 'restify-plugins'
import errors from 'restify-errors'
import _ from 'lodash'
import jsonApiFormatter, { sendUnsupportedType } from './formatter'
import generateRoutes from './routes'
import Database from './database'
import JsonApiHelper from './json-api-helper'

const defaultOptions = {
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
}

function isAuthenticated(authenticatedRoutes, route) {
  if (_.isEmpty(authenticatedRoutes)) {
    return true
  }
  return authenticatedRoutes.includes(route)
}

export default class ApiServer {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options)
    this.database = new Database(this.options.database.name, this.options.database)
    this.resources = {}
    this.authenticator = (req, res, next) => next()
    this.Sequelize = require('sequelize') // eslint-disable-line global-require
  }

  define(resource) {
    const model = this.database.defineModel(resource.type, resource.attributes)
    const isReadyPromise = model.sync({ force: true })
      .then(() => {
        model.bulkCreate(resource.examples)
        return true
      })
    const fieldsToOmit = _.keys(_.pickBy(resource.attributes, (attribute) => attribute.omit))
    const apiHelper = new JsonApiHelper(resource.type, 'sequelize', fieldsToOmit)
    this.resources[resource.type] = {
      model,
      routes: generateRoutes(model, apiHelper),
      authenticatedRoutes: resource.authenticatedRoutes || [],
      ready: isReadyPromise
    }
    return this.resources[resource.type]
  }

  authenticate(authenticationFunction) {
    this.authenticator = (req, res, next) => Promise.resolve(authenticationFunction(req))
      .then((result) => {
        if (result instanceof Error) {
          return next(new errors.ForbiddenError(result.message))
        }
        if (result) {
          return next()
        }
        return next(new errors.ForbiddenError())
      })
      .catch((error) => next(new errors.ForbiddenError(error.message)))
  }

  start() {
    Promise.all(_.map(this.resources, (resource) => resource.ready))
      .then(() => {
        const server = restify.createServer({
          name: this.options.name,
          version: this.options.version,
          formatters: {
            'application/vnd.api+json': jsonApiFormatter,
            'application/javascript': sendUnsupportedType,
            'application/json': sendUnsupportedType,
            'application/octet-stream': sendUnsupportedType,
            'text/plain': sendUnsupportedType
          }
        })
        server.use(plugins.acceptParser(['application/vnd.api+json']))
        server.use(plugins.jsonBodyParser())
        server.use(plugins.authorizationParser())

        _.forOwn(this.resources, (resource, type) => {
          const { authenticatedRoutes, routes } = resource
          server.get(`/${type}`, isAuthenticated(authenticatedRoutes, 'getAll') ? [this.authenticator, routes.getAll] : routes.getAll)
          server.get(`/${type}/:id`, isAuthenticated(authenticatedRoutes, 'get') ? [this.authenticator, routes.get] : routes.get)
          server.post(`/${type}`, isAuthenticated(authenticatedRoutes, 'create') ? [this.authenticator, routes.create] : routes.create)
          server.patch(`/${type}/:id`, isAuthenticated(authenticatedRoutes, 'update') ? [this.authenticator, routes.update] : routes.update)
          server.del(`/${type}/:id`, isAuthenticated(authenticatedRoutes, 'delete') ? [this.authenticator, routes.delete] : routes.delete)
        })

        server.listen(this.options.port, () => {
          console.log('%s listening at %s', server.name, server.url)
        })
      })
  }
}
