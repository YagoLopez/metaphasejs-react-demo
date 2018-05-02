import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from "./App";
import {Collection} from "./orm/collection";
import {query} from "./orm/query.builder";
import {User} from "./models/user";
import {Post} from "./models/post";
import {Comment} from "./models/comment";
import {LOG_FORMAT} from "./orm/yago.logger";



// Users -----------------------------------------------------------------
//todo: abrir issue en repo sql.js sobre thread safe
//todo: salvar modelos al construirlos?
// const users = new Collection(User);
// const user1 = new User({name: "user1", age: 11, admin: 1});
// const user2 = new User({name: "user2", age: 22, admin: 1});
// const user3 = new User({name: "user3", age: 33, admin: 1});
// users.save(user1);
// users.save(user2);
// users.save(user3);



// Posts -----------------------------------------------------------------
// const posts = new Collection(Post);
// const post1 = new Post({title: 'title post 1', content: 'content post 1'});
// const post2 = new Post({title: 'title post 2', content: 'content post 2'});
// const post3 = new Post({title: 'title post 3', content: 'content post 3'});
// post1.belongsTo(user1);
// post2.belongsTo(user1);
// post3.belongsTo(user2);
// posts.save(post1);
// posts.save(post2);
// posts.save(post3);

// Comments -----------------------------------------------------------------
// const comments = new Collection(Comment);
// const comment1 = new Comment({author: 'author1', date: 'date1'});
// const comment2 = new Comment({author: 'author2', date: 'date2'});
// comment1.belongsTo(post1);
// comment2.belongsTo(post1);
// comment1.save();
// comment2.save();

// --------------------------------------------------------------------------

// users.getAll();
// posts.getAll();
// comments.getAll();

// console.log('Get all with children');
// users.getAll({children: true});
// const result1 = db.execQuery('select posts.title, posts.content from posts, users where posts.user_id = users.id;');
// const result1 = query('posts').where('posts.user_id', '=', 'users.id').run();
// console.warn('result1', result1);
// ----------------------------------------------------------------------------------

// console.log('%cuser1 with all descendants', LOG_FORMAT.BG_YELLOW);
// user1.getChildrenAll();
// console.log(user1);

// console.log('%cget by id with all descendants', LOG_FORMAT.BG_YELLOW);
// const userWithChildren = users.getById(1, {children: true});
// const postWithChildren = posts.getById(1);
// users.getAll({children: true});


// const post3_withoutChildren = posts.getById(3);
// console.log('post3 without children', LOG_FORMAT.BG_YELLOW);
// console.log(post3_withoutChildren);
// const post3_withoutChildren2= posts.getById(1, {children: true});
// console.log(post3_withoutChildren2);

// console.log('%cPosts related to user1', LOG_FORMAT.BG_YELLOW);
// user1.getChildren(Post);
// user1.getChildren(Comment);
// console.log('%cPosts related to user2', LOG_FORMAT.BG_YELLOW);
// console.table( user2.getChildren(Post) );
// console.log('%cPosts related to user3', LOG_FORMAT.BG_YELLOW);
// console.table( user3.getChildren(Post) );

// console.log('%cUsers related to post1', LOG_FORMAT.BG_YELLOW);
// console.table( post1.getParent(User) );
// console.log('%cUsers related to post1', LOG_FORMAT.BG_YELLOW);
// console.table( post2.getChildren(User) );
// console.log('%cUsers related to post1', LOG_FORMAT.BG_YELLOW);
// console.table( post3.getChildren(User) );
//todo: intentar homogeneizar "query" y "query()" como una funcion ambas
//todo: intentar obtener los resultados como clases, no como pojos
// console.table( posts.query().where('id', 1).modify(rows).result );


// console.log( query.select().from('users').where('id', 2).run() );
// console.table( users.query().run() );
// console.table( users.query().where('id', 2).run() );

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);




