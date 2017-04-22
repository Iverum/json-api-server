import yayson from 'yayson'
import _ from 'lodash'

const { Store, Presenter } = yayson({ adapter: 'sequelize' })

export function generateRoutes(model) {
  const store = new Store()
  return {
    get: function getResource(req, res, next) {
      const presenter = new Presenter()
      presenter.type = model.getTableName()
      return model.findAll()
        .then((response) => {
          res.send(presenter.render(response))
          return next()
        })
    },

    create: function createResource(req, res, next) {
      const presenter = new Presenter()
      presenter.type = model.getTableName()
      const resource = store.sync(JSON.parse(req.body.toString('utf8')))
      delete resource.type
      return model.findOrCreate({ where: resource, default: resource })
        .spread(function(user, created) {
          if (created) {
            res.send(200, presenter.render(user))
          } else {
            res.send(201, presenter.render(user))
          }
          return next()
        })
    }
  }
}
