import {db} from "../database";
import {Collection} from "../collection";
import {User} from "./models/user";

const users = new Collection(User);
const user1 = new User({name: "user1", age: 11, admin: 0});
user1.save();

describe('Database Module', () => {

  test('execQuery()', () => {
    const result = db.execQuery( users.query().where('name', 'user1' ));
    expect(result.length).toBe(1);
  });

  test('runQuery()', () => {
    const query = users.query().where('name', 'user1');
    const result = db.runQuery(query);
    expect(result).toBeInstanceOf(db.constructor);
  });

  test('integrityCheck()', () => {
    expect( db.integrityCheck()[0] ).toHaveProperty('integrity_check', 'ok');
  });

});

