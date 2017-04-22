function generateRoutes(model) {
  return {
    get: function getResource(req, res, next) {
      return model.findAll()
        .then((response) => {
          res.send(response)
          return next()
        })
    }
  }
}

module.exports.generateRoutes = generateRoutes
