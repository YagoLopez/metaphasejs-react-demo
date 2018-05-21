import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from "./App";
import {db} from "./orm/database";
// import {Collection} from "./orm/collection";
// import {User} from "./models/user";
// import {Post} from "./models/post";
// import {Comment} from "./models/comment";
import {getUrlParameter} from "./orm/yago.logger";
// import {LOG_FORMAT} from "./orm/yago.logger";

declare const SQL: any;

//todo: abrir issue en repo sql.js sobre thread safe
//todo: salvar modelos al construirlos?


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



// Users -----------------------------------------------------------------
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
// const comment1 = new Comment({author: 'author1', date: '5/16/2018'});
// const comment2 = new Comment({author: 'author2', date: '6/16/2018'});
// comment1.belongsTo(post1);
// comment2.belongsTo(post1);
// comment1.save();
// comment2.save();
// --------------------------------------------------------------------------


/*
const loadDbFromDisk = (e?: XMLHttpRequestEventTarget): void => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'metaphase.sqlite', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = (e: any) => {
    const uInt8Array = new Uint8Array(e.target.response);
    const dbFile = new SQL.Database(uInt8Array);
    db.setDatabase(dbFile);
    const users = new Collection(User);
    const posts = new Collection(Post);
    const comments = new Collection(Comment);
    // users.getAll();
    // const users = query.select().from('users').run();
    // const posts = query.select().from('posts').run();
    // const comments = query.select().from('comments').run();
    const store = {users: users.getAll(), posts: posts.getAll(), comments: comments.getAll()};
    ReactDOM.render(<App store={store}/>, document.getElementById('root') as HTMLElement);
  };
  xhr.send();
};
*/

// loadDbFromDisk();

const appElement = document.getElementById('root') as HTMLElement;

function getDbFileName(): string {
  return getUrlParameter('dbfile');
};

function loadDbFromFile(): boolean {
  return getDbFileName().length > 0;
};

function renderApp() {
  ReactDOM.render(<App/>, appElement);
};


if (loadDbFromFile()) {
  fetch(getDbFileName())
    .then((response: any) => {
      if (response) {
        return response.arrayBuffer();
      }
    }).then((arrayBuffer: any) => {
    if (arrayBuffer) {
      const dbFile = new Uint8Array(arrayBuffer);
      const dbInstance = new SQL.Database(dbFile);
      db.setDatabase(dbInstance);
      try {
        db.integrityCheck();
      } catch (exception) {
        alert(`Database file not found: "${getDbFileName()}"`);
      }
      const logFormat = 'background: cornflowerblue; color: white; font-weight: ';
      console.log(`%c Database loaded from file "${getDbFileName()}" `, logFormat);
      db.execQuery('PRAGMA foreign_keys=ON;');
      renderApp();
    }
  })
    .catch((error: Error) => {
      console.error(error);
  })
} else {
  renderApp();
}