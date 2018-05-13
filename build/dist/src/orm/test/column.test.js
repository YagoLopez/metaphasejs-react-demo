import { Collection } from "../collection";
import { Column } from "../column";
import { User } from "./models/user";
import { Post } from "./models/post";
var users = new Collection(User);
var user1 = new User({ name: "user1", age: 11, admin: 0 });
var user2 = new User({ name: "user2", age: 22, admin: 1 });
var user3 = new User({ name: "user3", age: 33, admin: 1 });
user1.save();
user2.save();
user3.save();
describe('Column Class', function () {
    test('constructor()', function () {
        // The new column to test must be created before collection instantiation
        var newColumn = new Column({ name: 'newColumn', dbType: "varchar" /* STRING */ });
        Post.columns.push(newColumn);
        var posts = new Collection(Post);
        expect(Post.columns[3].name).toBe('newColumn');
        expect(Collection.hasColumn('posts', 'newColumn')).toBeTruthy();
    });
    test('createColumnsRelation()', function () {
        var tableSchema = Collection.getTableSchema(Post);
        expect(Post.columns[2].name).toBe('user_id');
        expect(Post.columns[2].dbType).toBe('integer');
        expect(Post.columns[2].foreignKey).toBeTruthy();
        expect(Post.columns[2].relatedTable).toBe('users');
        expect(Post.columns[2].unique).toBeUndefined();
        expect(Post.columns[2].defaultValue).toBeUndefined();
        expect(Post.columns[2].size).toBeUndefined();
        expect(Post.columns[2].notNullable).toBe(true);
        expect(Post.columns[2].index).toBeUndefined();
        expect(tableSchema[3].name).toBe('user_id');
        expect(tableSchema[3].type).toBe('integer');
        expect(tableSchema[3].notnull).toBeTruthy();
        expect(tableSchema[3].dflt_value).toBeNull();
        expect(tableSchema[3].pk).toBeFalsy();
    });
    describe('createColumn()', function () {
        test('Not nullable', function () {
            // User column "age" has "not nullable" constraint
            var user4 = new User({ name: "user4", admin: 0 });
            expect(function () {
                user4.save();
            }).toThrow();
        });
        test('Unique constraint', function () {
            // User column "name" has "unique" constraint
            var user5 = new User({ name: "user5", age: "55", admin: 0 });
            var user6 = new User({ name: "user5", age: "66", admin: 0 });
            expect(function () {
                user5.save();
                user6.save();
            }).toThrow();
        });
    });
    test('isForeignKey()', function () {
        var postTableColumns = Post.columns;
        expect(postTableColumns[2].foreignKey).toBeTruthy();
        expect(postTableColumns[1].foreignKey).toBeUndefined();
    });
});
//# sourceMappingURL=column.test.js.map