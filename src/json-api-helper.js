import yayson from 'yayson'
import _ from 'lodash'

const { Store } = yayson({ adapter: 'sequelize' })
const store = new Store()

export default class JsonApiHelper {
  constructor(type, adapter = 'sequelize', omitFields = []) {
    const jsonApi = yayson({ adapter })
    this.Presenter = class WrappedPresenter extends jsonApi.Presenter {}
    this.Presenter.prototype.type = type
    this.Presenter.prototype.attributes = function renderAttributes() {
      const attrs = jsonApi.Presenter.prototype.attributes.apply(this, arguments) // eslint-disable-line
      return _.omit(attrs, omitFields)
    }
  }

  deserialize(data) {
    const deserialized = store.sync(data)
    delete deserialized.type
    return deserialized
  }

  serialize(data) {
    const presenter = new this.Presenter()
    return presenter.render(data)
  }
}
