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
    Store = _yayson.Store;

var store = new Store();

var JsonApiHelper = function () {
  function JsonApiHelper(type) {
    var adapter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sequelize';

    _classCallCheck(this, JsonApiHelper);

    this.type = type;
    this.adapter = adapter;
  }

  _createClass(JsonApiHelper, [{
    key: 'deserialize',
    value: function deserialize(data) {
      var deserialized = store.sync(data);
      delete deserialized.type;
      return deserialized;
    }
  }, {
    key: 'serialize',
    value: function serialize(data) {
      var jsonApi = (0, _yayson3.default)({ adapter: this.adapter });
      var presenter = new jsonApi.Presenter();
      presenter.type = this.type;
      return presenter.render(data);
    }
  }]);

  return JsonApiHelper;
}();

exports.default = JsonApiHelper;