'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleJsonApi;
exports.sendUnsupportedType = sendUnsupportedType;

var _restifyErrors = require('restify-errors');

var _restifyErrors2 = _interopRequireDefault(_restifyErrors);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createError() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '500';
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Internal Server Error';
  var detail = arguments[2];

  if (_lodash2.default.isEmpty(detail)) {
    return { status: status, title: title };
  }
  return { status: status, title: title, detail: detail };
}

function handleError(res, body) {
  if (body instanceof _restifyErrors2.default.NotFoundError) {
    res.status(404);
    return {
      errors: [createError('404', 'Resource Not Found')]
    };
  }

  if (body.jse_cause instanceof SyntaxError) {
    res.status(400);
    return {
      errors: [createError('400', 'Bad Request', body.message)]
    };
  }

  res.status(500);
  return {
    errors: [createError('500', 'Internal Server Error', body.message)]
  };
}

function handleJsonApi(req, res, body, cb) {
  res.setHeader('content-type', 'application/vnd.api+json');
  if (body instanceof Error) {
    console.log('ERROR', body);
    var errorResponse = handleError(res, body);
    return cb(null, JSON.stringify(errorResponse));
  }
  var data = body ? JSON.stringify(body) : 'null';
  return cb(null, data);
}

function sendUnsupportedType(req, res) {
  res.send(415);
}