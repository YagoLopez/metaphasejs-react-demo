import {Collection} from "../collection";
import {User} from "./models/user";
import {Post} from "./models/post";
import {Comment} from "./models/comment";
import {Model} from "../model";

// Mock data

// Users -----------------------------------------------------------------
const users = new Collection(User);
const user1 = new User({name: "user1", age: 11, admin: 0});
const user2 = new User({name: "user2", age: 22, admin: 1});
const user3 = new User({name: "user3", age: 33, admin: 1});
users.save(user1);
users.save(user2);
users.save(user3);

// Posts -----------------------------------------------------------------
const posts = new Collection(Post);
const post1 = new Post({title: "title post 1", content: "content post 1"});
const post2 = new Post({title: "title post 2", content: "content post 2"});
const post3 = new Post({title: "title post 3", content: "content post 3"});
post1.belongsTo(user1);
post2.belongsTo(user1);
post3.belongsTo(user3);
posts.save(post1);
posts.save(post2);
posts.save(post3);

// Comments -----------------------------------------------------------------
const comments = new Collection(Comment);
const comment1 = new Comment({author: 'author1', date: 'date1'});
const comment2 = new Comment({author: 'author2', date: 'date2'});
comment1.belongsTo(post1);
comment2.belongsTo(post1);
comment1.save();
comment2.save();

// ---------------------------------------------------------------------------

describe('Model Class', () => {

  describe('● constructor()', () => {

    test('Without parameters', () => {
      const user4 = new User();
      user4.name = "user4";
      user4.age = 44;
      user4.admin = 0;
      const idUser4 = user4.save();
      const result = users.getByFilter({name: "user4", age: 44, admin: 0})[0];
      expect(result).toEqual({id: idUser4, name: "user4", age: 44, admin: 0});
    });

    test('With parameters', () => {
      const user5 = new User({name: "user5", age: 55, admin: 1});
      const idUser5 = user5.save();
      const result = users.getByFilter({name: "user5", age: 55, admin: 1})[0];
      expect(result).toEqual({id: idUser5, name: "user5", age: 55, admin: 1});
    });

  });


  test('getChildrenAll()', () => {
    user1.getChildrenAll();
    expect(user1.posts.length).toBe(2);
    expect(user1.posts[0]).toBeInstanceOf(Post);
    expect(user1.posts[0].comments.length).toBe(2);
    expect(user1.posts[0].comments[0]).toBeInstanceOf(Comment);
    expect(user1.posts[1].comments.length).toBe(0);
  });

  describe('● getChildren()', () => {

    test('From root model: user1.getChildren(Post)', () => {
      const user1Related = user1.getChildren(Post);
      expect(user1Related.length).toBe(2);
      expect(user1Related[0]).toBeInstanceOf(Post);
    });

    test('From not root model: post1.getChildren(Comment)', () => {
      const post1Children = post1.getChildren(Comment);
      expect(post1Children.length).toBe(2);
      expect(post1Children[0]).toBeInstanceOf(Comment);
    });

    test('Model has no children: user3.getChildren(Post)', () => {
      const result = post3.getChildren(Comment);
      expect(result.length).toBe(0);
    });

    test('Invalid children model argument: user1.getChildren(Comment)', () => {
      let result;
      expect( ()=> result = user1.getChildren(Comment) );
      expect(result).toBeUndefined();
    });

    test('Invalid children model argument: post1.getChildren(User)', () => {
      let result;
      expect( ()=> result = user1.getChildren(User) );
      expect(result).toBeUndefined();
    });

    test('Invalid children model argument: post1.getChildren(Post)', () => {
      let result;
      expect( ()=> result = user1.getChildren(Post) );
      expect(result).toBeUndefined();
    });

  });

  describe('● getParent()', () => {

    test('Model has one parent', () => {
      const parent1 = post1.getParent(User)[0];
      expect(parent1).toHaveProperty('name', 'user1');
    });

    // test.only('Model has more than one parent', () => {
    // });

  });

  test('create()', () => {
    const user4 = Model.create({name: 'user4', age: 44, admin: 1}, User);
    expect(user4).toHaveProperty('name', 'user4');
    expect(user4).toHaveProperty('age', 44);
    expect(user4).toHaveProperty('admin', 1);
  });

  test('not isSaved()', () => {
    const user6 = Model.create({name: 'user6', age: 66, admin: 0}, User);
    expect(user6.isSaved()).toBeFalsy();
  });

  test('isSaved()', () => {
    const user6 = Model.create({name: 'user6', age: 66, admin: 0}, User);
    user6.save();
    expect(user6.isSaved()).toBeTruthy();
  });

  describe('● belongsTo()', () => {

    test('parent is saved', () => {
      const user7 = new User({name: 'user7', age: 77, admin: 0});
      user7.save();
      const post4 = new Post({title: 'title post 4', content: 'content post 4'});
      post4.belongsTo(user7);
      post4.save();
      expect(user7.getChildren(Post)[0]).toHaveProperty('title', 'title post 4');
    });

    test('parent is not saved', () => {
      const user8 = new User({name: 'user8', age: 88, admin: 0});
      const post5 = new Post({title: 'title post 5', content: 'content post 5'});
      expect(() => {
        post5.belongsTo(user8);
      }).toThrow();
    });

  });

});
