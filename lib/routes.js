'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRoutes = generateRoutes;

var _yayson2 = require('yayson');

var _yayson3 = _interopRequireDefault(_yayson2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _yayson = (0, _yayson3.default)({ adapter: 'sequelize' }),
    Store = _yayson.Store,
    Presenter = _yayson.Presenter;

function generateRoutes(model) {
  var store = new Store();
  return {
    get: function getResource(req, res, next) {
      var presenter = new Presenter();
      presenter.type = model.getTableName();
      return model.findAll().then(function (response) {
        res.send(presenter.render(response));
        return next();
      });
    },

    create: function createResource(req, res, next) {
      var presenter = new Presenter();
      presenter.type = model.getTableName();
      var resource = store.sync(JSON.parse(req.body.toString('utf8')));
      delete resource.type;
      return model.findOrCreate({ where: resource, default: resource }).spread(function (user, created) {
        if (created) {
          res.send(200, presenter.render(user));
        } else {
          res.send(201, presenter.render(user));
        }
        return next();
      });
    }
  };
}