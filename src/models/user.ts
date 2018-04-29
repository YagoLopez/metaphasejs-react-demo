import {Model} from "../orm/model";
import {column} from "../orm/decorators";
import {Post} from "./post";

export class User extends Model {

  @column()
  name: string;

  @column({notNullable: true, index: true})
  age: number;

  @column()
  admin: number;

  hasMany() {
    return [Post];
  }

}
