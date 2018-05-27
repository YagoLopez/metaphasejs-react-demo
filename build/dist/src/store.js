import { Collection } from "./orm/collection";
import { User } from "./models/user";
import { Post } from "./models/post";
import { Comment } from "./models/comment";
console.clear();
// Users -----------------------------------------------------------------
export var users = new Collection(User);
var user1 = new User({ name: "user1", age: 11, admin: 1 });
var user2 = new User({ name: "user2", age: 22, admin: 1 });
var user3 = new User({ name: "user3", age: 33, admin: 1 });
users.save(user1);
users.save(user2);
users.save(user3);
// Posts -----------------------------------------------------------------
export var posts = new Collection(Post);
var post1 = new Post({ title: 'title post 1', content: '<div>content post 1 asfasdfa dfas fasfd asdf asdf asdf asdf asdf asdf asdfasdfasdfasd fasd </div>' });
var post2 = new Post({ title: 'title post 2', content: 'content post 2' });
var post3 = new Post({ title: 'title post 3', content: 'content post 3' });
post1.belongsTo(user1);
post2.belongsTo(user1);
post3.belongsTo(user2);
posts.save(post1);
posts.save(post2);
posts.save(post3);
// Comments -----------------------------------------------------------------
export var comments = new Collection(Comment);
var comment1 = new Comment({ author: 'author1', date: '5/16/2018' });
var comment2 = new Comment({ author: 'author2', date: '6/16/2018' });
comment1.belongsTo(post1);
comment2.belongsTo(post1);
comment1.save();
comment2.save();
// --------------------------------------------------------------------------
//# sourceMappingURL=store.js.map