import restify from 'restify'
import plugins from 'restify-plugins'
import _ from 'lodash'
import jsonApiFormatter, { sendUnsupportedType } from './formatter'
import generateRoutes from './routes'
import Database from './database'
import JsonApiHelper from './json-api-helper'

const defaultOptions = {
  name: 'JSON::API Server',
  version: '1.0.0',
  port: 8080
}

export default class ApiServer {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options)
    this.database = new Database('database', { storage: './database.sqlite' })
    this.resources = {}
    this.Sequelize = require('sequelize') // eslint-disable-line global-require
  }

  define(resource) {
    const model = this.database.defineModel(resource.type, resource.attributes)
    const fieldsToOmit = _.keys(_.pickBy(resource.attributes, (attribute) => attribute.omit))
    const apiHelper = new JsonApiHelper(resource.type, 'sequelize', fieldsToOmit)
    this.resources[resource.type] = {
      model,
      routes: generateRoutes(model, apiHelper)
    }
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

    _.forOwn(this.resources, (value, key) => {
      value.model.sync({ force: true })
      server.get(`/${key}`, value.routes.getAll)
      server.get(`/${key}/:id`, value.routes.get)
      server.post(`/${key}`, value.routes.create)
      server.patch(`/${key}/:id`, value.routes.update)
      server.del(`/${key}/:id`, value.routes.delete)
    })

    server.listen(this.options.port, () => {
      console.log('%s listening at %s', server.name, server.url)
    })
  }
}
