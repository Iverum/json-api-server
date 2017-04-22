'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yayson2 = require('yayson');

var _yayson3 = _interopRequireDefault(_yayson2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _yayson = (0, _yayson3.default)({ adapter: 'sequelize' }),
    Store = _yayson.Store,
    Presenter = _yayson.Presenter;

var store = new Store();

var JsonApiHelper = function () {
  function JsonApiHelper(type) {
    _classCallCheck(this, JsonApiHelper);

    this.type = type;
  }

  _createClass(JsonApiHelper, [{
    key: 'serialize',
    value: function serialize(data) {
      var presenter = new Presenter();
      presenter.type = this.type;
      return presenter.render(data);
    }
  }], [{
    key: 'deserialize',
    value: function deserialize(data) {
      var deserialized = store.sync(data);
      delete deserialized.type;
      return deserialized;
    }
  }]);

  return JsonApiHelper;
}();

exports.default = JsonApiHelper;