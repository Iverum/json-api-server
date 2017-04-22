import JsonApiHelper from '../json-api-helper'

describe('JsonApiHelper', () => {
  const helper = new JsonApiHelper('users', 'default')
  const serializedTestData = {
    data: {
      id: '1',
      type: 'users',
      attributes: {
        firstName: 'Blake',
        lastName: 'Hair'
      }
    }
  }
  const unserializedTestData = {
    id: '1',
    firstName: 'Blake',
    lastName: 'Hair'
  }

  test('unserializes data', () => {
    expect(helper.deserialize(serializedTestData)).toEqual(unserializedTestData)
  })

  test('serializes data', () => {
    expect(helper.serialize(unserializedTestData)).toEqual(serializedTestData)
  })
})
