import _ from 'lodash'
import JsonApiHelper from '../json-api-helper'

describe('JsonApiHelper', () => {
  const helper = new JsonApiHelper('users', 'default', ['password'])
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
    lastName: 'Hair',
    password: 'password'
  }

  test('unserializes data', () => {
    expect(helper.deserialize(serializedTestData)).toEqual(_.omit(unserializedTestData, ['password']))
  })

  test('serializes data', () => {
    expect(helper.serialize(unserializedTestData)).toEqual(serializedTestData)
  })
})
