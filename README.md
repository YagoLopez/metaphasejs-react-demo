<p align="center"><img width="100" src="/public/mp-logo-leftmenu.svg" style="width: 100px"/></p>

# MetaphaseJS Demo

Demostration of MetaphaseJS framework ( **ALPHA VERSION** ).

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

**MetaphaseJS** is a super easy, efficient and agnostic state manager for Javascript. It can be used with React, Angular o vanilla JS. In this demo ReactJS and Typescript have been used.

## Demo

- :arrow_right: [Use this link to access the demo](https://yagolopez.js.org/metaphasejs-react-demo/build/)
- :arrow_right: Or scan the QR code to load the demo in a smartphone:

<p align="center"><img src="qrcode.jpg"/></p>

## Why

- State management is an issue solved decades ago in server-side environments using transactional and relational databases. This is not the case of client-side apps (browser) where it has remained unsolved until the advent of libraries/patterns like Redux/Flux
- These other client-state managers produce verbose and complicated code (inmutability adds levels of indirection and therefore complexity) and they are basically reinventing the wheel
- Store in Redux is essentially a big key-value object and therefore it is not appropiated for nested and relational data
- There are other client databases like IndexDB, LovefieldDB, etc. but they also are complicated (callbacks, asynchrony) or very elementary (localStorage)
- The intention of MetaphaseJS is to apply the same techniques of server-side state management to client-side apps.

## Features

- Simplicity: no callbacks, no asynchronous code, no functional nor inmutable complexities 
- Agnostic: it can be used with ReactJS, Angular, Vue, React Native, vanilla JS, etc. Simply plug-and-play
- State is a true SQLite relational database
- State can be managed with SQL queries generated by an ORM (Object Relational Mapper) following the patterns:
  1. Data-Mapper/Repository
  2. Active-Record
- State can be saved to a database file
- State can be designed and populated with any db tool that supports SQLite (even using a graphical UI without using code) and after that it can be imported into app
- Great developer productivity and satisfacction. (For example, an entire blog sistem could be developed in minutes)
- Ideal for statically generated content (i. e.: static blogs without a server database)
- Comprehensive and switchable logger system. It can be turned off in production for better performance . A simple url query parameter controls the logger `http://app_url?logger=true/false`
- Use of Reflection-Metadata API and Decorators to simplify model definitions (with Typescript)

## How

- [Sql.js](https://github.com/kripken/sql.js) is a Javascript library that uses [Emscriptem](http://kripken.github.io/emscripten-site/)/[WebAssembly](https://webassembly.org/)  to recompile the SQLite C++ code to Javascript. This means you can create a SQLite database in browser and use all its functionality.
- MetaphaseJS uses `Sql.js` to hold the application state in a **in-memory SQLite database**:
  1. You create classes for your models/entities
  2. Set up relations between models
  3. Create collections of models
  4. Execute operations on models (CRUD)
- You can use an ORM to execute queries or raw SQL
- You can load the state from a database file or from a dababase created from code
- You can save the state to a file on disk

## Requirements

- Modern browser
- Yarn package manager (or NPM)

## Installation

- Clone the project
- Run `yarn` in the project directory

## Usage

- Run `yarn start`
- Test `yarn test`
- Code coverage`yarn coverage` :arrow_right: [link](./coverage/lcov-report/index.html)
- Package analysis `yarn analysis` :arrow_right: [link](./analysis/packages.html)


## Contributing

1. Fork it
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Docs

TODO: generate API documentation with TypeDoc

## UML Diagram of the state

<p align="center"><img src="./uml/uml.png"/></p>

## Code Samples

1. Creation of models and relations

```typescript
// User model definition (ids are automatically generated) -------------
export class User extends Model {

  @column()
  name: string;

  @column({notNullable: true, index: true})
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
comment1.save();
comment2.save();
```



3. Operations with data
- Filtering:

```typescript
// Get all users
users.getAll();

// Get all users with children (related models)
users.getAll({children: true});

// Get all users using raw sql
// TODO

// Get user with name 'user1'
users.getByFilter({name: 'user1'})

// Get users
users.getByFilter({name: 'user1', age: 11, admin: 0});

// TODO more examples
```

- Create/Read/Update/Delete (CRUD):

```typescript
// Save/update user1 using model
user1.name = 'new name';
user1.save();

// Save/update user1 using collection
users.save(user1);

// Delete user1 using model
user1.remove();

// Delete user1 using collection
users.remove(user1);

// TODO more examples

```

   

## Credits

- [FontAwesome](https://fontawesome.com/license)
- [Sql.js](https://github.com/kripken/sql.js)
- [KnexJs](http://knexjs.org)

## License

MIT

<p align="center"><a href="#">Back to top :arrow_up:</a></p>