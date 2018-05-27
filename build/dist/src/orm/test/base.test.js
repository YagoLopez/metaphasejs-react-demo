import { Collection } from "../collection";
import { query } from "../query.builder";
import { User } from "./models/user";
import { Post } from "./models/post";
import { Comment } from "./models/comment";
var users = new Collection(User);
var user1 = new User({ name: "user1", age: 11, admin: 0 });
var user2 = new User({ name: "user2", age: 22, admin: 1 });
describe('Base Class', function () {
    test('tableName()', function () {
        expect(user1.tableName()).toBe('users');
        expect(users.tableName()).toBe('users');
    });
    test('insert()', function () {
        var user3 = new User({ name: 'user3', age: 33, admin: 1 });
        user3.save();
        var result = query().select().from('users').where({ name: 'user3', age: 33 }).run()[0];
        expect(result).toHaveProperty('name', 'user3');
        expect(result).toHaveProperty('age', 33);
    });
    describe('● update()', function () {
        test('Model created with constructor parameters', function () {
            var user4 = new User({ name: 'user4', age: 44, admin: 1 });
            user4.age = 400;
            user4.save();
            user4.name = 'name changed';
            user4.save();
            var result = query().select().from('users').where({ name: 'name changed', age: 400 }).run()[0];
            expect(result).toHaveProperty('name', 'name changed');
            expect(result).toHaveProperty('age', 400);
        });
        test('Model created without constructor parameters', function () {
            var user5 = new User();
            user5.name = 'user5';
            user5.age = 55;
            user5.save();
            var result = query().select().from('users').where({ name: 'user5', age: 55 }).run()[0];
            expect(result).toHaveProperty('name', 'user5');
            expect(result).toHaveProperty('age', 55);
        });
    });
    test('save()', function () {
        var user6 = new User({ name: 'user6', age: 66, admin: 1 });
        user6.save();
        var result = query().select().from('users').where({ name: 'user6', age: 66 }).run()[0];
        expect(result).toHaveProperty('name', 'user6');
        expect(result).toHaveProperty('age', 66);
    });
    describe('● remove()', function () {
        test('Remove model without children (no cascade deletion)', function () {
            var user7 = new User({ name: 'user7', age: 77, admin: 0 });
            users.save(user7);
            var idUserRemoved = user7.remove();
            expect(query().select().from('users').where('id', idUserRemoved).run().length).toBe(0);
            var user8 = new User({ name: 'user8', age: 88, admin: 0 });
            users.save(user8);
            var idUserRemoved2 = users.remove(user8);
            expect(users.query().where('id', idUserRemoved2).run().length).toBe(0);
        });
        test('Remove model with children (cascade deletion)', function () {
            var user9 = new User({ name: 'user9', age: 99, admin: 0 });
            users.save(user9);
            var posts = new Collection(Post);
            var post9 = new Post({ title: 'title post 9', content: 'content post 9' });
            post9.belongsTo(user9);
            post9.save();
            var comments = new Collection(Comment);
            var comment9 = new Comment({ author: 'author9', date: 'date9' });
            comment9.belongsTo(post9);
            comment9.save();
            user9.remove();
            var result1 = posts.getByFilter({ title: 'title post 9' });
            var result2 = comments.getByFilter({ author: 'author9' });
            expect(result1.length).toBe(0);
            expect(result2.length).toBe(0);
        });
    });
});
//# sourceMappingURL=base.test.js.map