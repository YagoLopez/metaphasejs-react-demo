import {Model, column, DBtype} from "metaphasejs";
import {Comment} from "./comment";

export class Post extends Model {

  @column({notNullable: true})
  title: string;

  @column({dbType: DBtype.TEXT, notNullable: true})
  content: string;

  hasMany() {
    return [Comment];
  }

}
