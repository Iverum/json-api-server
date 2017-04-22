import yayson from 'yayson'

const { Store, Presenter } = yayson({ adapter: 'sequelize' })
const store = new Store()

export default class JsonApiHelper {
  constructor(type) {
    this.type = type
  }

  deserialize(data) {
    const deserialized = store.sync(data)
    delete deserialized.type
    return deserialized
  }

  serialize(data) {
    const presenter = new Presenter()
    presenter.type = this.type
    return presenter.render(data)
  }
}
