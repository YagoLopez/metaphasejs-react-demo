import {Model} from "../orm/model";
import {column} from "../orm/decorators";

export class Comment extends Model {

  @column()
  author: string;

  @column()
  date: string;

}
