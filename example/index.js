import apiServer from '../lib'

const { Sequelize } = apiServer

apiServer.define({
  type: 'users',
  attributes: {
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING }
  }
})
apiServer.start()
