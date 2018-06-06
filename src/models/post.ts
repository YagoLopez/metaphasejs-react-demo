import {Model, column} from "metaphasejs";
import {Comment} from "./comment";

enum DBtype {
  INTEGER = 'integer',
  REAL = 'real',
  BOOLEAN = 'integer', // SQLite does not admit boolean values natively
  STRING = 'varchar',
  TEXT = 'text',
  DATE = 'varchar',
  BLOB = 'blob',
  NULL = 'null' // null is reserved word
}


export class Post extends Model {

  @column({notNullable: true})
  title: string;

  @column({dbType: DBtype.TEXT, notNullable: true})
  content: string;

  hasMany() {
    return [Comment];
  }

}
