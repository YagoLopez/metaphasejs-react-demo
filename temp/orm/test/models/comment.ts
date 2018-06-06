import {Model} from "../../model";
import {Column} from "../../column";
import {DBtype} from "../../types";

export class Comment extends Model {

  public static columns: Column[] = [
    new Column({name: 'author', dbType: DBtype.STRING}),
    new Column({name: 'date', dbType: DBtype.STRING})
  ];

}
