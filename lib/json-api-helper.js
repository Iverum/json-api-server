'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yayson2 = require('yayson');

var _yayson3 = _interopRequireDefault(_yayson2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _yayson = (0, _yayson3.default)({ adapter: 'sequelize' }),
    Store = _yayson.Store;

var store = new Store();

var JsonApiHelper = function () {
  function JsonApiHelper(type) {
    var adapter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sequelize';
    var omitFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, JsonApiHelper);

    var jsonApi = (0, _yayson3.default)({ adapter: adapter });
    this.Presenter = function (_jsonApi$Presenter) {
      _inherits(WrappedPresenter, _jsonApi$Presenter);

      function WrappedPresenter() {
        _classCallCheck(this, WrappedPresenter);

        return _possibleConstructorReturn(this, (WrappedPresenter.__proto__ || Object.getPrototypeOf(WrappedPresenter)).apply(this, arguments));
      }

      return WrappedPresenter;
    }(jsonApi.Presenter);
    this.Presenter.prototype.type = type;
    this.Presenter.prototype.attributes = function renderAttributes() {
      var attrs = jsonApi.Presenter.prototype.attributes.apply(this, arguments); // eslint-disable-line
      return _lodash2.default.omit(attrs, omitFields);
    };
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
      var presenter = new this.Presenter();
      return presenter.render(data);
    }
  }]);

  return JsonApiHelper;
}();

exports.default = JsonApiHelper;