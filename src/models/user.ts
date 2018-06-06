import {Model, column} from "metaphasejs";
import {Post} from "./post";

export class User extends Model {

  @column()
  name: string;

  @column({notNullable: true, index: true})
  age: number;

  @column({notNullable: true})
  admin: number;

  hasMany() {
    return [Post];
  }

}
