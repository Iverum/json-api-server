import ApiServer from '../lib'

const exampleServer = new ApiServer({
  name: 'Example Server'
})
const { Sequelize } = exampleServer

const users = exampleServer.define({
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
  },
  examples: [{
    firstName: 'Test',
    lastName: 'User',
    password: 'password'
  }]
})

exampleServer.authenticate((request) => {
  try {
    const { username, password } = request.authorization.basic
    return users.model.findOne({ where: { firstName: username } })
      .then((user) => user.get('password') === password)
      .catch(() => new Error('No match found for username/password'))
  } catch (error) {
    return new Error('No match found for username/password')
  }
})

exampleServer.start()
