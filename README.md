# json-api-server

A framework implementing [`json:api`](http://jsonapi.org/).

## Motivation

This framework is written with the goal of creating a tool that I can use to rapidly build APIs that conform the the json:api specification. There are a number of existing frameworks that do very similar things, but they either lack features I desire or are too lightweight and ambiguous about their use cases.

My goal with this framework is to create a tool where a developer can specify a set of resources and the framework will automatically provide CRUD for those resources, while still allowing extensions to the basic routes.

This framework is tightly coupled to the [Sequelize ORM](http://docs.sequelizejs.com/en/v3/) for now. If you're looking for a similar framework with more options for the storage solution I'd encourage you to check out [jsonapi-server](https://github.com/holidayextras/jsonapi-server). It was almost what I needed and may suit your needs.