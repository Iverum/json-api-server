'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
};

var Database = function () {
  function Database(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Database);

    var mergedOptions = Object.assign({}, defaultOptions, options);
    this.sequelize = new _sequelize2.default(name, mergedOptions.username, mergedOptions.password, mergedOptions);
  }

  _createClass(Database, [{
    key: 'defineModel',
    value: function defineModel(type, attributes) {
      return this.sequelize.define(type, attributes, { freezeTableName: true });
    }
  }]);

  return Database;
}();

exports.default = Database;