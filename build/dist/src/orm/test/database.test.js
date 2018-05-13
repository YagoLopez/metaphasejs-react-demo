import { db } from "../database";
import { Collection } from "../collection";
import { User } from "./models/user";
var users = new Collection(User);
var user1 = new User({ name: "user1", age: 11, admin: 0 });
user1.save();
describe('Database Module', function () {
    test('execQuery()', function () {
        var result = db.execQuery(users.query().where('name', 'user1'));
        expect(result.length).toBe(1);
    });
    test('runQuery()', function () {
        var query = users.query().where('name', 'user1');
        var result = db.runQuery(query);
        expect(result).toBeInstanceOf(db.constructor);
    });
    test('integrityCheck()', function () {
        expect(db.integrityCheck()[0]).toHaveProperty('integrity_check', 'ok');
    });
});
//# sourceMappingURL=database.test.js.map