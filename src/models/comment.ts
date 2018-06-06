import {Model, column} from "metaphasejs";

export class Comment extends Model {

  @column()
  author: string;

  @column()
  date: string;

}
