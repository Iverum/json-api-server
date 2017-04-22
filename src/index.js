import restify from 'restify'
import plugins from 'restify-plugins'
import _ from 'lodash'
import Sequelize from 'sequelize'

import jsonApiFormatter, { sendUnsupportedType } from './formatter'
import generateRoutes from './routes'
import Database from './database'

const database = new Database('database', { storage: './database.sqlite' })
const resources = {}

const apiServer = {
  Sequelize,
  define: function define(resource) {
    const model = database.defineModel(resource.type, resource.attributes)
    resources[resource.type] = {
      model,
      routes: generateRoutes(model)
    }
  },

  start: function start() {
    const server = restify.createServer({
      name: 'JSON::API Server',
      version: '1.0.0',
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

    _.forOwn(resources, (value, key) => {
      value.model.sync({ force: true })
      server.get(`/${key}`, value.routes.getAll)
      server.get(`/${key}/:id`, value.routes.get)
      server.post(`/${key}`, value.routes.create)
      server.patch(`/${key}/:id`, value.routes.update)
      server.del(`/${key}/:id`, value.routes.delete)
    })

    server.listen(8080, () => {
      console.log('%s listening at %s', server.name, server.url)
    })
  }
}
export default apiServer
