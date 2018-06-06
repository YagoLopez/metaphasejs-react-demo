import {db} from "../database";
import {Collection} from "../collection";
import {User} from "./models/user";
import {Post} from "./models/post";
import {Comment} from "./models/comment";

//todo: hacer fichero para cargar mock data solo una vez

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


describe('Collection Class', () => {

  test('constructor()', () => {
    expect(Collection.hasColumn('users', 'name')).toBeTruthy();
    expect(Collection.hasColumn('users', 'age')).toBeTruthy();
    expect(Collection.hasColumn('users', 'admin')).toBeTruthy();

    expect(Collection.hasColumn('posts', 'title')).toBeTruthy();
    expect(Collection.hasColumn('posts', 'content')).toBeTruthy();

    expect(Collection.getTableSchema(User).length).toBe(4);
    expect(Collection.getTableSchema(Post).length).toBe(4);
  });

  test('query() - query builder obtained from collection', () => {
    const result = users.query().where('name', 'user1').run();
    expect(result.length).toBe(1);
  });

  describe('● getById()', () => {

    test('getById(1) - searched model has children', () => {
      const user_withChildren1 = users.getById(1);
      expect(user_withChildren1).toHaveProperty('name', 'user1');
      expect(user_withChildren1.posts).toBeUndefined();
    });

    test('getById(1, {children: false}) - searched model has children', () => {
      const user_withChildren2 = users.getById(1, {children: false});
      expect(user_withChildren2).toHaveProperty('name', 'user1');
      expect(user_withChildren2.posts).toBeUndefined();
    });

    test('getById(3, {children: true}) - searched model has not children: ', () => {
      const post3_withChildren = posts.getById(3, {children: true});
      expect(post3_withChildren.comments.length).toBe(0);
    });

  });

  describe('● getByFilter()', () => {

    test('getByFilter({name: user1}) - searched model has children, column param, no children param', () => {
      const result = users.getByFilter({name: 'user1'}, ['name']);
      expect(result[0]).toHaveProperty('name', 'user1');
      expect(result[0].age).toBeUndefined();
      expect(result[0].admin).toBeUndefined();
      expect(result[0].posts).toBeUndefined();
    });

    test('getByFilter({name: user1}) - searched model has children and no children parameter', () => {
      const userWithChildren1 = users.getByFilter({name: 'user1'});
      expect(userWithChildren1.length).toBe(1);
      expect(userWithChildren1[0].posts).toBeUndefined();
    });

    test('getByFilter({name: user1, age: 11, admin: 0}) - searched model has children and no children parameter', () => {
      const user_withChildren2 = users.getByFilter({name: 'user1', age: 11, admin: 0});
      expect(user_withChildren2.length).toBe(1);
      expect(user_withChildren2[0].posts).toBeUndefined();
    });

    test('getByFilter({name: user1}, {children: false}) - searched model has children and children parameter', () => {
      const user_withChildren3 = users.getByFilter({name: 'user1'}, [], {children: false});
      expect(user_withChildren3.length).toBe(1);
      expect(user_withChildren3[0].posts).toBeUndefined();
    });

    test('getByFilter(3, {children: true}) - searched model has not children and children parameter', () => {
      const post3_withChildren2 = posts.getByFilter({title: 'title post 3'}, [], {children: true})[0];
      expect(post3_withChildren2.comments.length).toBe(0);
    });

  });

  describe('● getByOperator()', () => {

    test('getByOperator("name", "=", "user1") - searched model has children', () => {
      const u1 = users.getByOperator('name', '=', 'user1');
      expect(u1.length).toBe(1);
      expect(u1[0].posts).toBeUndefined();
    });

    test('getByOperator("age", "<", 20, ["name"]) - searched model has children, column param, no children param', () => {
      const result = users.getByOperator('age', '<', 20, ['name']);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('name', 'user1');
      expect(result[0].age).toBeUndefined();
      expect(result[0].admin).toBeUndefined();
      expect(result[0].posts).toBeUndefined();
    });

    test('getByOperator("name", "=", "user1", [], {children: true}) - searched model has children', () => {
      const u2 = users.getByOperator('name', '=', 'user1', [], {children: true});
      expect(u2.length).toBe(1);
      expect(u2[0].posts.length).toBe(2);
    });

    test('getByOperator("name", "=", "user1", [], {children: false}) - searched model has children', () => {
      const u3 = users.getByOperator('name', '=', 'user1', [], {children: false});
      expect(u3.length).toBe(1);
      expect(u3[0].posts).toBeUndefined();
    });

    test('getByOperator("title", "=", "title post 3", [], {children: true}) - searched model has not children', () => {
      const p2 = posts.getByOperator('title', '=', 'title post 3', [], {children: true});
      expect(p2.length).toBe(1);
      expect(p2[0].comments.length).toBe(0);
    });

  });

  describe('● getAll()', () => {

    test('without children', () => {
      const allComments = comments.getAll();
      expect(allComments.length).toBe(2);
    });

    test('with children', () => {
      const allUsers = users.getAll({children: true});
      expect(allUsers.length).toBe(3);
      expect(allUsers[0].posts.length).toBe(2);
      expect(allUsers[0].posts[0].comments.length).toBe(2);
      expect(allUsers[0].posts[1].comments.length).toBe(0);
      expect(allUsers[1].posts.length).toBe(0);
      expect(allUsers[2].posts.length).toBe(1);
    });

  });

  test('getTableSchema()', () => {
    const result = Collection.getTableSchema(User);
    const columnName = result[1] as any;
    expect(result.length).toBe(4);
    expect(columnName.dflt_value).toBeNull();
    expect(columnName.name).toBe('name');
    expect(columnName.notnull).toBe(0);
    expect(columnName.pk).toBe(0);
    expect(columnName.type).toBe('varchar(255)');
  });

  test('hasColumn()', () => {
    expect( Collection.hasColumn('users', 'name') ).toBe(true);
    expect( Collection.hasColumn('users', 'age') ).toBe(true);
    expect( Collection.hasColumn('users', 'xxx') ).toBe(false);
  });

  // Note: this test must be the last one in the file
  test('getIdLastRecordInserted()', () => {
    const user4 = new User({name: "user4", age: 44, admin: 1});
    const idUser4 = users.save(user4);
    expect( db.getIdLastRecordInserted() ).toBe(idUser4);
  });

  test('deleteTable()', () => {
    Collection.deleteTable('posts');
    expect(Collection.getTableSchema(Post).length).toBe(0);
  });

});
