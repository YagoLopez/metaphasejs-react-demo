import {Model} from "../../model";
import {DBtype} from "../../types";
import {Column} from "../../column";
import {Post} from "./post";

export class User extends Model {

  /**
   * In Jest tests, Typescript decorators can not be used. Model properties (table columns) have to be
   * defined as 'Column' Classes
   * @type {[Column]} Columns array
   */
  public static columns: Column[] = [
    new Column({name: 'name', dbType: DBtype.STRING, unique: true}),
    new Column({name: 'age', dbType: DBtype.INTEGER, notNullable: true}),
    new Column({name: 'admin', dbType: DBtype.BOOLEAN})
  ];

  public hasMany() {
    return [Post];
  }

}
