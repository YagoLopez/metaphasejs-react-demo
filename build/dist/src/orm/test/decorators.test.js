import { getDBTypeFromPropType } from "../decorators";
import { Collection } from "../collection";
import { User } from "./models/user";
// Users -----------------------------------------------------------------
var users = new Collection(User);
var user1 = new User({ name: "user1", age: 11, admin: 0 });
// ------------------------------------------------------------------------
describe('Column Decorator', function () {
    test('column()', function () {
        var columnName = user1.__proto__.constructor.columns[0];
        expect(columnName.name).toBe('name');
        expect(columnName.dbType).toBe('varchar');
        expect(columnName.defaultValue).toBe(undefined);
        expect(columnName.foreignKey).toBe(undefined);
        expect(columnName.index).toBe(undefined);
        expect(columnName.notNullable).toBe(undefined);
        expect(columnName.relatedTable).toBe(undefined);
        expect(columnName.unique).toBe(true);
        expect(columnName.size).toBe(undefined);
    });
    test('getDBTypeFromPropType(String)', function () {
        var result = getDBTypeFromPropType('String');
        expect(result).toBe("varchar" /* STRING */);
    });
    test('getDBTypeFromPropType(Number)', function () {
        var result = getDBTypeFromPropType('Number');
        expect(result).toBe("integer" /* INTEGER */);
    });
    test('getDBTypeFromPropType(Null)', function () {
        var result = getDBTypeFromPropType('Null');
        expect(result).toBe("null" /* NULL */);
    });
    test('getDBTypeFromPropType(Boolean) - Invalid prop type', function () {
        expect(function () {
            getDBTypeFromPropType('Boolean');
        }).toThrow();
    });
});
//# sourceMappingURL=decorators.test.js.map