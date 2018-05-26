# MetaphaseJS Demo

Demostration of MetaphaseJS framework ( **ALPHA VERSION** ).

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

**MetaphaseJS** is a super easy, efficient and agnostic state manager for Javascript. It can be used with React, Angular o vanilla JS. In this demo ReactJS and Typescript have been used.

## Demo

- :computer: [Use this link to access the demo](https://yagolopez.js.org/metaphasejs-react-demo/build/)
- :iphone: Or scan the QR code to load the demo in a smartphone:

<p align="center"><img src="qrcode-metaphasejs-demo-small.jpg"/></p>

## Why

- State management is an issue solved decades ago in server-side environments using transactional and relational databases. This is not the case of client-side (browser) apps where it has remained as an unsolved issue until the advent of libraries/patterns like Redux/Flux
- These other client state managers like Redux produce verbose and complicated code (inmutability adds levels of indirection and therefore complexity) and they are basically reinventing the wheel
- There are other client databases like IndexDB, LovefieldDB, etc. but they are complicated too (callbacks, asynchrony) or incomplete (localStorage)
- The intention of MetaphaseJS is to apply the same techniques of server-side state management to client-side apps.

## Features

- Simplicity: no callbacks, no asynchronous code, no functional nor inmutable complexities 
- Agnostic and frameworkless: it can be used with ReactJS, Angular, Vue, React Native, vanilla JS, etc. Simply plug-and-play

- State is a true SQLite relational database
- Manage state with simple SQL queries and an ORM (Object Relational Mapper)
- State can be saved to a database file
- State can be designed and populated with any db tool that supports SQLite (even using a graphical UI without using code) and after that imported into app
- Great developer productivity and satisfacction. (For example, an entire blog sistem could be developed in minutes)
- Ideal for static generated content (i. e.: static blogs without a server database)
- Comprehensive and switchable logger system. It can be turned off in production for better performance . A simple url query string parameter controls the logger `http://app_url?logger=true/false`

## How

- Using Emscriptem/WebAssembly the C++ code of SQLite has been compiled as any other Javascript library that you can load in the browser environment
- You can hold the application state in a true relational SQLite database. 
  - You can create model (or entity) classes
  - Setup relations between models
  - Create collections of models
  - Execute operations on models
- You can use an ORM to execute queries
- You can load the state from a database file
- You can save the state to a file on disk

## Requirements

- Yarn package manager (or NPM)

## Installation

- Clone the project
- Run `yarn` in the project directory

## Usage

- Run `yarn start`
- Test `yarn test`

## Contributing

1. Fork it
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Docs

TODO: generate API documentation with TypeDoc

## Code Samples

Models and relations definitions

```typescript
// User model definition --------------------------------------------------
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



Collections definition

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



Operations with data

```typescript
// Get all users
users.getAll();

// Get all users with children (related models)
users.getAll({children: true});

// TODO more examples
```



## Credits

- [FontAwesome](https://fontawesome.com/license)

## License

MIT
