import {Base} from "./base";
import {query} from "./query.builder";
import {NotSavedModelError} from "./exceptions";


export abstract class Model extends Base {

  [otherProps: string]: any;

  constructor(props?: Model | {}) {
    super();
    Object.assign(this, props);
  }

  /**
   * Factory for model instance creation
   * @param {Object} pojo (plain old javascript object)
   * @param {any} modelClass
   * @returns {Model}
   */
  public static create(pojo: Object, modelClass: any): Model {
    return new modelClass(pojo);
  }

  public isSaved(): boolean {
    return this.id !== undefined;
  }

  private getForeignKeyColumnName(): string {
    return this.constructor.name.toLowerCase() + '_id';
  }

  //todo: parametro para opcion escribir el modelo en la tabla de la bd {save: true}
  public belongsTo(model: Model): Model {
    if ( !model.isSaved ) {
      throw new Error('Invalid model instance: ' + model);
    }
    if( !model.isSaved() ) {
      throw new NotSavedModelError(model, this);
    }
    const foreignColumnName = model.getForeignKeyColumnName();
    this[foreignColumnName] = model.id;
    return this;
  }

  //todo: esto corresponde a la direccion inversa de una relacion. Igual se podria implementar como un decorator
  //igual que getChildren(). el decorador tendria que crear la fn hasMany() y getParent() o getChildren()
  //dependiendo de lado de la relacion (consultar typeorm para ver como lo hace)
  public getParent(model: any & Model): Model[] {
    if( !this.isSaved() ) {
      throw new NotSavedModelError(this, model);
    }
    const relatedTable = model.prototype.tableName();
    const fkColumnName = model.prototype.getForeignKeyColumnName();
    const idColValue = this[fkColumnName];
    const relatedModels: Model[] = query(relatedTable).where('id', idColValue).run();
    return relatedModels.map( obj => Model.create(obj, model) );
  }

  //todo: intentar crear dinamicamente esta funcion como "posts()" por ejemplo
  /**
   * Get first level related children models
   * @param model
   * @returns {Model[]}
   */
  public getChildren(model: any & Model): Model[] {
    if( !this.isSaved() ) {
      throw new NotSavedModelError(this, model);
    }
    const childTable = model.prototype.tableName();
    const fkColumnChildTable = this.getForeignKeyColumnName();
    try {
      const relatedModels: Model[] = query(childTable).where(fkColumnChildTable, this.id).run();
      return relatedModels.map( obj => Model.create(obj, model) );
    } catch(exception) {
      console.error(`Model ${JSON.stringify(this)} has no children of type "${model.name}"`);
      console.error(exception);
      return [];
    }
  }

  /**
   * Get recursively all descendant models from this model
   */
  public getChildrenAll(): void {
    if (this.hasMany) {
      const childClasses = this.hasMany();
      for (let i = 0; i < childClasses.length; i++ ) {
        const childModels = this.getChildren(childClasses[i]);
        const newPropName = childClasses[i].prototype.tableName();
        this[newPropName] = [];
        for (let j = 0; j < childModels.length; j++ ) {
          this[newPropName].push(childModels[j]);
          childModels[j].getChildrenAll(); // recursive call
        }
      }
    }
  }

  //todo: testar esta fn
  /**
   * Makes related models properties not enumerable
   * Use: if a model is fetched with all related (or children) models
   * when this model is saved an error is thrown due to properties containing related models
   * are not original model properties
   * This function can be used to "hide" (not enumerate) these props and save the model
   * @param {Model} model
   * returns {Model}
   */
  public static omitChildrenProps(model: any): Model {
    model.hasChildren() && model.hasMany().forEach((relatedModel: Model) => {
      try {
        Object.defineProperty(model, relatedModel.prototype.tableName(), {enumerable: false});
      } catch(exception) {
        console.error(exception);
        alert(exception)
      }
    });
    return model;
  }

  public hasChildren(): boolean {
    return this.hasMany !== undefined;
  }


  // private isChildModel(): boolean {
  //   const columns: Column[] = this.__proto__.constructor.columns;
  //   let result = false;
  //   for (let i = 0; i < columns.length; i++) {
  //     if ( columns[i].isForeignKey() ) {
  //       result = true;
  //       break;
  //     }
  //   }
  //   return result;
  // }
  //

//   public existsTableInDB(): boolean {
//     const rows = db.exec( query.schema.hasTable(this.tableName()).toString() );
//     return rows && rows.length > 0
//   }

  // public existsInTable() {
  //   return db.execQuery(`select * from ${this.tableName()} where id=${this.id}`);
  // }

  // private hasTableColumn(model: Model, columnName: string): boolean {
  //   const columns = model.columns;
  //   const columnNames: string[] = columns.map((column: Column) => {
  //     return column.name;
  //   });
  //   return columnNames.indexOf(columnName) > -1;
  // }



  // public setRelated(model: Model): number | string {
  //   let foreignId: number | string;
  //   try {
  //     if(this.id) {
  //       foreignId = this.id;
  //     } else {
  //       foreignId = this.save();
  //     }
  //     const foreignColumnName = this.getForeignKeyColumnName();
  //     model[foreignColumnName] = foreignId;
  //     return model.save();
  //   } catch(error) {
  //     console.log(error);
  //     return -1;
  //   }
  // }

}


