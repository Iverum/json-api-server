const restify = require('restify')
const plugins = require('restify-plugins')
const _ = require('lodash')
const Sequelize = require('sequelize')
const routes = require('./routes')
const Database = require('./database')

const database = new Database('database', { storage: './database.sqlite' })
const resources = {}

apiServer = {
  define: function define(resource) {
    const model = database.defineModel(resource.type, resource.attributes)
    resources[resource.type] = {
      model: model,
      routes: routes.generateRoutes(model)
    }
  },

  start: function start() {
    function sendUnsupportedType(req, res) {
      res.send(415)
    }

    const server = restify.createServer({
      name: 'JSON::API Server',
      version: '1.0.0',
      formatters: {
        'application/vnd.api+json': function handleJsonApi(req, res, body, cb) {
          res.setHeader('content-type', 'application/vnd.api+json')
          var data = (body) ? JSON.stringify(body) : 'null'
          return cb(null, data)
        },
        'application/javascript': sendUnsupportedType,
        'application/json': sendUnsupportedType,
        'application/octet-stream': sendUnsupportedType,
        'text/plain': sendUnsupportedType
      }
    })
    server.use(plugins.acceptParser(['application/vnd.api+json']))

    _.forOwn(resources, function mapResources(value, key) {
      value.model.sync({ force: true })
      server.get(`/${key}`, value.routes.get)
    })

    server.listen(8080, function() {
      console.log('%s listening at %s', server.name, server.url)
    })
  }
}

module.exports = apiServer

apiServer.define({
  type: 'users',
  attributes: {
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING }
  }
})
apiServer.start()
