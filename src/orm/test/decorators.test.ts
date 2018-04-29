import {column, getDBTypeFromPropType} from "../decorators";
import {DBtype} from "../types";
import {Collection} from "../collection";
import {User} from "./models/user";


// Users -----------------------------------------------------------------
const users = new Collection(User);
const user1 = new User({name: "user1", age: 11, admin: 0});
// ------------------------------------------------------------------------

describe('Column Decorator', () => {

  test('column()', () => {
    const columnName = user1.__proto__.constructor.columns[0];
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

  test('getDBTypeFromPropType(String)', () => {
    const result = getDBTypeFromPropType('String');
    expect(result).toBe(DBtype.STRING);
  });

  test('getDBTypeFromPropType(Number)', () => {
    const result = getDBTypeFromPropType('Number');
    expect(result).toBe(DBtype.INTEGER);
  });

  test('getDBTypeFromPropType(Null)', () => {
    const result = getDBTypeFromPropType('Null');
    expect(result).toBe(DBtype.NULL);
  });

  test('getDBTypeFromPropType(Boolean) - Invalid prop type', () => {
    expect(() => {
      getDBTypeFromPropType('Boolean');
    }).toThrow();
  });

});