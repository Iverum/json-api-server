import apiServer from '../lib'

const { Sequelize } = apiServer

apiServer.define({
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
    }
  }
})
apiServer.start()
