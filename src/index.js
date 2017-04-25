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
    model.sync({ force: true })
      .then(() => {
        model.bulkCreate(resource.examples)
      })
    const fieldsToOmit = _.keys(_.pickBy(resource.attributes, (attribute) => attribute.omit))
    const apiHelper = new JsonApiHelper(resource.type, 'sequelize', fieldsToOmit)
    this.resources[resource.type] = {
      model,
      routes: generateRoutes(model, apiHelper)
    }
    return this.resources[resource.type]
  }

  authenticate(authenticationFunction) {
    // Should wrap the function and only pass it the request.
    // The function should take a request and a return true if authenticated
    // The function should throw an error or return false if unauthenticated
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

    _.forOwn(this.resources, (value, key) => {
      server.get(`/${key}`, this.authenticator, value.routes.getAll)
      server.get(`/${key}/:id`, this.authenticator, value.routes.get)
      server.post(`/${key}`, this.authenticator, value.routes.create)
      server.patch(`/${key}/:id`, this.authenticator, value.routes.update)
      server.del(`/${key}/:id`, this.authenticator, value.routes.delete)
    })

    server.listen(this.options.port, () => {
      console.log('%s listening at %s', server.name, server.url)
    })
  }
}
