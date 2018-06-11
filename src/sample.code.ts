export const sampleCode = `

import {Model, Collection, column} from 'metaphasejs';

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

`;