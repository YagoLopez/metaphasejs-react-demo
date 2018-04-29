import {Model} from "../../model";
import {Column} from "../../column";
import {DBtype} from "../../types";
import {Comment} from "./comment"

export class Post extends Model {

  //todo: por defecto el tipo de columna deberia ser string (?)
  public static columns: Column[] = [
    new Column({name: 'title', dbType: DBtype.STRING}),
    new Column({name: 'content', dbType: DBtype.STRING}),
  ];

  hasMany () {
    return [Comment]
  }

}
