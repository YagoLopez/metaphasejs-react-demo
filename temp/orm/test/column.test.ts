import {Collection} from "../collection";
import {Column} from "../column";
import {DBtype} from "../types";
import {User} from "./models/user";
import {Post} from "./models/post";


const users = new Collection(User);
const user1 = new User({name: "user1", age: 11, admin: 0});
const user2 = new User({name: "user2", age: 22, admin: 1});
const user3 = new User({name: "user3", age: 33, admin: 1});
user1.save();
user2.save();
user3.save();

describe('Column Class', () => {

  test('constructor()', () => {
    // The new column to test must be created before collection instantiation
    const newColumn = new Column({name: 'newColumn', dbType: DBtype.STRING});
    Post.columns.push(newColumn);

    const posts = new Collection(Post);
    expect(Post.columns[3].name).toBe('newColumn');
    expect(Collection.hasColumn('posts', 'newColumn')).toBeTruthy();
  });

  test('createColumnsRelation()', () => {
    const tableSchema: any = Collection.getTableSchema(Post);
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

  describe('createColumn()', () => {

    test('Not nullable', () => {
      // User column "age" has "not nullable" constraint
      const user4 = new User({name: "user4", admin: 0});
      expect(() => {
        user4.save();
      }).toThrow();
    });

    test('Unique constraint', () => {
      // User column "name" has "unique" constraint
      const user5 = new User({name: "user5", age: "55", admin: 0});
      const user6 = new User({name: "user5", age: "66", admin: 0});
      expect(() => {
        user5.save();
        user6.save();
      }).toThrow();
    });

  });

  test('isForeignKey()', () => {
    const postTableColumns = Post.columns;
    expect(postTableColumns[2].foreignKey).toBeTruthy();
    expect(postTableColumns[1].foreignKey).toBeUndefined();
  });

});
