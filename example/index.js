import ApiServer from '../lib'

const exampleServer = new ApiServer({
  name: 'Example Server'
})
const { Sequelize } = exampleServer

exampleServer.define({
  type: 'users',
  attributes: {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      omit: true
    }
  }
})
exampleServer.start()
