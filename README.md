# json-api-server

> A framework for RESTful APIs implementing [`json:api`](http://jsonapi.org/).

## Usage
```js
import JsonApiServer from 'json-api-server'

const server = new JsonApiServer({ name: 'Example Server' })
const { Sequelize } = server

server.define({
  type: 'photos',
  attributes: {
    title: { type: Sequelize.STRING },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    height: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true,
        min: 1,
        max: 10000
      }
    },
    width: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true,
        min: 1,
        max: 10000
      }
    }
  }
})

server.start()
```

## API
```js
import JsonApiServer from 'json-api-server'
```

### const jsonApiServer = new JsonApiServer([options])
Creates a new server instance configured with the passed in options.

- `options` (Object) - If passed in the options will be merged with the default options shown below:
```js
{
  name: 'JSON::API Server', // this will be set in the Server response header
  port: 8080,
  database: {
    name: 'database',
    username: null,
    password: null,
    host: 'localhost',
    dialect: 'sqlite', // mysql || sqlite
    storage: './database.sqlite' // location for the SQLite database
  }
}
```

### const resource = jsonApiServer.define(definition)
Creates a resource for the server. A resource will automatically define default CRUD routes and a [Sequelize model](http://sequelize.readthedocs.io/en/latest/docs/models-definition/) and will create a table for the resource if none exists on the database.

- `definition` (Object) - A resouce definition is an object that defines. At most a definition should include a `type` and an object for `attributes`.
```js
  type: 'photos' // Will be used as the type in json:api responses and as the root for your URLs related to this resource
  attributes: { // Attributes mostly follow the rules for defining a Sequelize model
    title: { type: jsonApiServer.Sequelize.STRING }, // An attributes requires at least a type
    url: {
      type: jsonApiServer.Sequelize.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    }, // More options can be added to allow for validation of the attribute
    superSecretMetadata: {
      type: jsonApiServer.Sequelize.STRING,
      omit: true // Attributes you'd like to leave out of the server responses can be omitted
    }
  },
  authenticatedRoutes: ['create', 'update', 'delete'], // An array of routes that should be authenticated. An empty array or falsy value will authenticate all routes
  examples: [{ // An array of resources to be created when the tables are created. This is useful to prototype in conjunction with sqlite
    title: 'An Example',
    url: 'http://www.example.com/'
  }]
```

### jsonApiServer.start()
Starts the server listening on the appropriate port and creates any missing database tables.

## Install
`npm install --save json-api-server`

## Motivation

This framework is written with the goal of creating a tool that I can use to rapidly build APIs that conform the the json:api specification. There are a number of existing frameworks that do very similar things, but they either lack features I desire or are too lightweight and ambiguous about their use cases.

My goal with this framework is to create a tool where a developer can specify a set of resources and the framework will automatically provide CRUD for those resources, while still allowing extensions to the basic routes.

This framework is tightly coupled to the [Sequelize ORM](http://docs.sequelizejs.com/en/v3/) for now. If you're looking for a similar framework with more options for the storage solution I'd encourage you to check out [jsonapi-server](https://github.com/holidayextras/jsonapi-server). It was almost what I needed and may suit your needs.
