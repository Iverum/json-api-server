function getResource(req, res, next) {
  res.send('Hello, world!')
  return next()
}

module.exports.get = getResource
