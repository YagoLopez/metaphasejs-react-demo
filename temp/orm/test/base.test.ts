import {Collection} from "../collection";
import {query} from "../query.builder";
import {User} from "./models/user";
import {Post} from "./models/post";
import {Comment} from "./models/comment";


const users = new Collection(User);
const user1 = new User({name: "user1", age: 11, admin: 0});
const user2 = new User({name: "user2", age: 22, admin: 1});


describe('Base Class', () => {

  it('tableName()', () => {
    expect(user1.tableName()).toBe('users');
    expect(users.tableName()).toBe('users');
  });

  it('insert()', () => {
    const user3 = new User({name: 'user3', age: 33, admin: 1});
    user3.save();
    const result = query().select().from('users').where({name: 'user3', age: 33}).getOne();
    expect(result).toHaveProperty('name', 'user3');
    expect(result).toHaveProperty('age', 33);
  });

  describe('● update()', () => {

    it('Model created with constructor parameters', () => {
      const user4 = new User({name: 'user4', age: 44, admin: 1});
      user4.age = 400;
      user4.save();
      user4.name = 'name changed';
      user4.save();
      const result = query().select().from('users').where({name: 'name changed', age: 400}).getOne();
      expect(result).toHaveProperty('name', 'name changed');
      expect(result).toHaveProperty('age', 400);
    });

    it('Model created without constructor parameters', () => {
      const user5 = new User();
      user5.name = 'user5';
      user5.age = 55;
      user5.save();
      const result = query().select().from('users').where({name: 'user5', age: 55}).getOne();
      expect(result).toHaveProperty('name', 'user5');
      expect(result).toHaveProperty('age', 55);
    });

  });

  it('save()', () => {
    const user6 = new User({name: 'user6', age: 66, admin: 1});
    user6.save();
    const result = query().select().from('users').where({name: 'user6', age: 66}).getOne();
    expect(result).toHaveProperty('name', 'user6');
    expect(result).toHaveProperty('age', 66);
  });

  describe('● remove()', () => {

    it('Remove model without children (whitout cascade deletion)', () => {
      const user7 = new User({name: 'user7', age: 77, admin: 0});
      users.save(user7);
      const idUserRemoved = user7.remove();
      expect(query().select().from('users').where('id', idUserRemoved).run().length).toBe(0);

      const user8 = new User({name: 'user8', age: 88, admin: 0});
      users.save(user8);
      const idUserRemoved2 = users.remove(user8);
      expect(users.query().where('id', idUserRemoved2).run().length).toBe(0);
    });

    it('Remove model with children (with cascade deletion)', () => {
      const user9 = new User({name: 'user9', age: 99, admin: 0});
      users.save(user9);

      const posts = new Collection(Post);
      const post9 = new Post({title: 'title post 9', content: 'content post 9'});
      post9.belongsTo(user9);
      post9.save();

      const comments = new Collection(Comment);
      const comment9 = new Comment({author: 'author9', date: 'date9'});
      comment9.belongsTo(post9);
      comment9.save();

      user9.remove();
      const result1 = posts.getByFilter({title: 'title post 9'});
      const result2 = comments.getByFilter({author: 'author9'});
      expect(result1.length).toBe(0);
      expect(result2.length).toBe(0);

    });

  });

});