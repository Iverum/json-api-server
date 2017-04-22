'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleJsonApi;
exports.sendUnsupportedType = sendUnsupportedType;

var _restifyErrors = require('restify-errors');

var _restifyErrors2 = _interopRequireDefault(_restifyErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(res, body) {
  if (body instanceof _restifyErrors2.default.NotFoundError) {
    res.status(404);
    return {
      errors: [{
        status: '404',
        title: 'Resource Not Found'
      }]
    };
  }

  res.status(500);
  return {
    errors: [{
      status: '500',
      title: 'Internal Server Error',
      detail: body.message
    }]
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