const Sequelize = require('sequelize')

const defaultOptions = {
  username: null,
  password: null,
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}

class Database {
  constructor(name, options = {}) {
    const mergedOptions = Object.assign({}, defaultOptions, options)
    this._sequelize = new Sequelize(
      name,
      mergedOptions.username,
      mergedOptions.password,
      mergedOptions
    )
  }

  defineModel(type, attributes) {
    return this._sequelize.define(type, attributes, { freezeTableName: true })
  }
}

module.exports = Database
