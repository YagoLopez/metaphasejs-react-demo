# MetaphaseJS Demo

Demostration of MetaphaseJS framework ( **BETA VERSION** ).

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges) [![Build Status](https://travis-ci.org/YagoLopez/metaphasejs-react-demo.svg?branch=master)](https://travis-ci.org/YagoLopez/metaphasejs-react-demo) [![Maintainability](https://api.codeclimate.com/v1/badges/c1a754523798b48ec180/maintainability)](https://codeclimate.com/github/YagoLopez/metaphasejs-react-demo/maintainability)

**MetaphaseJS** is a super easy, efficient and agnostic state manager for Javascript. It can be used with React, Angular o vanilla JS. In this demo React and Typescript have been used. :arrow_right: ​[Link to repository](https://github.com/YagoLopez/metaphasejs)

## Demo

- :arrow_right: [Use this link to access the demo](https://yagolopez.js.org/metaphasejs-react-demo/build/)
- :arrow_right: Or scan the QR code to load the demo in a smartphone:

<p align="center"><img src="qrcode.jpg"/></p>

## Index

- [Why](#why)
- [Features](#features)
- [How](#how)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [API Docs](#api-docs)
- [Entity-Relation State Diagram](#entity-relation-state-diagram)
- [Code](#code)
- [Credits](#credits)
- [License](#license)

## Why

- State management is an issue solved decades ago in server-side environments using transactional and relational databases. This is not the case of client-side apps (browser) where it has remained unsolved until the advent of libraries/patterns like Redux/Flux
- Client-state managers based on Flux architecture produce verbose and complicated code (inmutability adds levels of indirection and hence complexity) and they are basically reinventing the wheel trying to recreate a sort of in-browser database
- Store in Redux is essentially a big key-value object which is not appropiate for nested and relational data
- There are other client databases like IndexDB, LovefieldDB, etc. but they are complicated (callbacks, asynchrony) or very elementary (localStorage)
- The intention of MetaphaseJS is to apply the same server-side state management techniques to client-side apps.

## Features

- Simplicity: no callbacks, no asynchronous code, no functional nor inmutable complexities 
- Agnostic: it can be used with ReactJS, Angular, Vue, React Native, vanilla JS, etc. Just plug-and-play
- State is a true relational SQLite database
- State can be managed with SQL queries generated by Metaphase ORM ([Object-Relational Mapper](https://en.wikipedia.org/wiki/Object-relational_mapping)). It implements the following patterns:
  - [Repository](https://martinfowler.com/eaaCatalog/repository.html)
  - [Active-Record](https://en.wikipedia.org/wiki/Active_record_pattern)
- State can be saved to a database file on disk
- State can be designed and populated with any db tool that supports SQLite (even using a graphical UI without using code) and after that, it can be imported into an app
- Great developer productivity and satisfacction. For example, an entire blog sistem could be developed in minutes
- Ideal for statically generated content (i. e.: static blogs without a server database)
- Comprehensive and switchable logger system. It can be turned off in production for better performance . A simple url query parameter controls the logger `http://url-app?logger=true/false`
- Use of Reflection-Metadata API and Decorators to simplify model definitions (when Typescript is used)
- In SQLite by default all operations are transactional. This means protection against race conditions when state is accessed by asynchronous writes

## How

- [Sql.js](https://github.com/kripken/sql.js) is a Javascript library that uses [Emscriptem](http://kripken.github.io/emscripten-site/)/[WebAssembly](https://webassembly.org/)  to recompile the SQLite C++ code to Javascript. This means you can create a SQLite database in browser and use all its functionality.
- MetaphaseJS uses `Sql.js` to hold the application state in a **in-memory SQLite database**:
  - You create classes for your models (also called *entities*)
  - Set up relations between models
  - Create collections of models
  - Execute operations with models (CRUD)
- You can use an ORM to execute queries, or raw SQL
- You can load state:
  - From a database file on disk
  - From a database created at runtime by code
- You can save the state to a file on disk
- As always you can persist the state to a server using http requests.

## Requirements

- Modern browser
- Yarn package manager (or NPM)

## Installation

- Clone the project
- Run `yarn` in the project directory

## Usage

- Run `yarn start`
- Test `yarn test`
- Code coverage `yarn coverage` :arrow_right: [link](https://yagolopez.js.org/metaphasejs-react-demo/coverage/lcov-report/index.html)
- Packages analysis `yarn analysis` :arrow_right: [link](https://yagolopez.js.org/metaphasejs-react-demo/analysis/packages.html)


## Contributing

1. Fork it
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## API Docs

:arrow_right: [Link](https://yagolopez.js.org/metaphasejs/docs/index.html)

## Entity-Relation State Diagram

<p align="center"><img src="/src/uml/uml.jpg"/></p>

## Code

1. Creation of models and relations.

```typescript
// ---------------------------------------------------------------------
// This simplified example is written in Typescript using decorators
// For regular Javascript you can define columns using "Column" class.
// (See tests)
// ---------------------------------------------------------------------

// User model definition (ids are automatically generated) -------------
export class User extends Model {

  @column()
  name: string;

  @column({notNullable: true, index: true}) // example of column specifying values
  age: number;

  @column()
  admin: number;

  hasMany() {
    return [Post];
  }
}

// Post model definition -------------------------------------------------
export class Post extends Model {

  @column()
  title: string;

  @column({dbType: DBtype.TEXT})
  content: string;

  hasMany() {
    return [Comment];
  }
}

// Comment model definition -----------------------------------------------
export class Comment extends Model {

  @column()
  author: string;

  @column()
  date: string;
}
```



2. Definition of collections and relations

```typescript

// Users collection -------------------------------------------------------
const users = new Collection(User);
const user1 = new User({name: "user1", age: 11, admin: 1});
const user2 = new User({name: "user2", age: 22, admin: 1});
const user3 = new User({name: "user3", age: 33, admin: 1});
users.save(user1);
users.save(user2);
users.save(user3);

// Posts collection --------------------------------------------------------
const posts = new Collection(Post);
const post1 = new Post({title: 'title post 1', content: 'content post 1'});
const post2 = new Post({title: 'title post 2', content: 'content post 2'});
const post3 = new Post({title: 'title post 3', content: 'content post 3'});
post1.belongsTo(user1);
post2.belongsTo(user1);
post3.belongsTo(user2);
posts.save(post1);
posts.save(post2);
posts.save(post3);

// Comments collection -----------------------------------------------------
const comments = new Collection(Comment);
const comment1 = new Comment({author: 'author1', date: '5/16/2018'});
const comment2 = new Comment({author: 'author2', date: '6/16/2018'});
comment1.belongsTo(post1);
comment2.belongsTo(post1);
comments.save(comment1);
comments.save(comment2);
```



3. Operations with data

   3. 1 Filtering:
```typescript
// Get all users
users.getAll();

// Get all users with children (related models)
users.getAll({children: true});

// Get all users using raw sql
users.query().raw('select * from users');

// Get user by id = 1
users.getById(1);

// Get user with name 'user1'
users.getByFilter({name: 'user1'})

// Get user with name: 'user1', age: 11 and admin: 0
users.getByFilter({name: 'user1', age: 11, admin: 0});

// See tests for more examples
```

   3. 2 Create/Read/Update/Delete (CRUD):

```typescript
// user1 modification
user1.name = 'new name';

// Save/update user1 using an instance of Model class
user1.save();

// Save/update user1 using an instance of Collection class
users.save(user1);

// Delete user1 using an instance of Model class
user1.remove();

// Delete user1 using an instance of Collection class
users.remove(user1);

// TODO more examples

```

   

## Credits

- [Font Awesome](https://fontawesome.com/license)
- [Sql.js](https://github.com/kripken/sql.js)
- [KnexJS](http://knexjs.org)

## License

MIT

<p align="center"><a href="#">Back to top :arrow_up:</a></p> 

