import yayson from 'yayson'

const { Store } = yayson({ adapter: 'sequelize' })
const store = new Store()

export default class JsonApiHelper {
  constructor(type, adapter = 'sequelize') {
    this.type = type
    this.adapter = adapter
  }

  deserialize(data) {
    const deserialized = store.sync(data)
    delete deserialized.type
    return deserialized
  }

  serialize(data) {
    const jsonApi = yayson({ adapter: this.adapter })
    const presenter = new jsonApi.Presenter()
    presenter.type = this.type
    return presenter.render(data)
  }
}
