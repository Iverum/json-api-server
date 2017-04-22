"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRoutes = generateRoutes;
function generateRoutes(model) {
  return {
    get: function getResource(req, res, next) {
      return model.findAll().then(function (response) {
        res.send(response);
        return next();
      });
    }
  };
}