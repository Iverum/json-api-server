import generateRoutes from '../routes'

describe('generateRoutes', () => {
  test('does generate all routes', () => {
    const routes = generateRoutes({
      getTableName: () => 'tests'
    })
    expect(routes).toHaveProperty('getAll')
    expect(routes.getAll).toBeInstanceOf(Function)
    expect(routes).toHaveProperty('get')
    expect(routes.get).toBeInstanceOf(Function)
    expect(routes).toHaveProperty('create')
    expect(routes.create).toBeInstanceOf(Function)
    expect(routes).toHaveProperty('update')
    expect(routes.update).toBeInstanceOf(Function)
    expect(routes).toHaveProperty('delete')
    expect(routes.delete).toBeInstanceOf(Function)
  })
})
