import {Model} from "../orm/model";
import {column} from "../orm/decorators";
import {DBtype} from "../orm/types";
import {Comment} from "./comment";

export class Post extends Model {

  @column()
  title: string;

  @column({dbType: DBtype.TEXT})
  content: string;

  hasMany() {
    return [Comment];
  }

}
