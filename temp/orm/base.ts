import {db} from "./database";
import {Model} from "./model";
import {query} from "./query.builder";
import {logQuery} from "./yago.logger";


export abstract class Base {

  protected model: Model;

  public tableName(): string {
    let name;
    if(this.model) {
      name = this.model.name;
    } else {
      name = this.constructor.name;
    }
    return name.toLowerCase() + 's';
  }

  protected insert(model?: any): number | string {
    model = model || this;
    query.insert(model).into(this.tableName()).run();
    model.id = db.getIdLastRecordInserted();
    return model.id;
  }

  protected update(model?: any): number | string {
    query.table(this.tableName()).update(model).where('id', model.id).run();
    return model.id;
  }

  public save(model?: any): number | string {
    model = model || this;
    let idModelSaved: number | string;
    if (model.isSaved()) {
      idModelSaved = this.update(model);
    } else {
      idModelSaved = this.insert(model);
    }
    (idModelSaved > 0) && logQuery(`Saved ${model.constructor.name} with id: ${idModelSaved}`, 'result');
    return idModelSaved;
  }

  public remove(model?: any): number {
    model = model || this;
    const deleteQuery = `delete from ${this.tableName()} where id=${model.id}`;
    db.run(deleteQuery);
    logQuery(deleteQuery, 'query');
    logQuery(`Deleted ${this.constructor.name} with id: ${model.id}`, 'result');
    return model.id;
  }

}
