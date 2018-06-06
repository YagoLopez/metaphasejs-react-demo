//todo: poder ejecutar consulta sql que conste de varias sentencias en varias lineas
//todo: quitar el plural de las tablas = tableName();
//todo: hacer fn para paginacion. params: limit (rows per page), offset: (num. pag)
//getAllPaginated(pagNum, recordNum)
//todo: probar en edge y explorer
//todo: hacer mutators transaccionales o averiguar si por defecto sqlite hace las operaciones transaccionales
//todo: no usar cadena literal para nombre de columna 'id'
//todo: faltan relaciones "one to one" y "many to many"
//todo: documentar funciones
//todo: fn borrar tabla
//todo: implementar logger usando decorators
import {db} from "./database";
import {query} from "./query.builder";
import {Column} from "./column";
import {Base} from "./base";
import {Model} from "./model";
import {TableBuilder} from "knex";
import {DBtype} from "./types";


/**
 * Manages a collection of models (rows in a db table)
 * It follows Repository pattern
 */
export class Collection extends Base {

  constructor(protected model: any) {
    super();
    if (this.hasRelations()) {
      this.createRelations();
    }
    this.createTable(this.tableName(), model.columns);
  }

  private createTable(tableName: string, columns: Column[]): void {
    const createTableQuery = query.schema.raw('PRAGMA foreign_keys=ON')
      .dropTableIfExists(tableName).createTable(
      tableName, (tableBuilder: TableBuilder) => {
        this.createColumns(columns, tableBuilder)
      });
    db.runQuery(createTableQuery);
  }

  //todo: hacer static
  private createColumns(columns: Column[], tableBuilder: TableBuilder): void {
    tableBuilder.increments('id');
    for (let i in columns) {
      columns[i].createColumn(tableBuilder);
    }
  }

  /**
   * Given an array of pojos it returns an array of model instances
   * @param {Object[]} pojos (Plain Old Javascript Object)
   * @returns {Object[]}
   */
  public createModelInstances(pojos: Object[]): Model[] {
    for (let i = 0; i < pojos.length; i++) {
      pojos[i] = Model.create(pojos[i], this.model);
    }
    return pojos as Model[];
  }

  public getAll( load: {children: boolean} = {children: false} ): Model[] {
    const result = db.execQuery(`select * from ${this.tableName()}`);
    const models: Model[] = this.createModelInstances(result);
    console.table(result);
    if (load.children) {
      models.forEach( (model: Model) => model.getChildrenAll() );
      return models;
    } else {
      return this.createModelInstances(result);
    }
  }

  public getById( id: string | number, load: {children: boolean} = {children: false} ): Model {
    const result = db.execQuery(`select * from ${this.tableName()} where id=${id}`)[0];
    const model = new this.model(result);
    console.log(model);
    if (load.children) {
      model.getChildrenAll();
    }
    return model;
  }

  public getByFilter(filter: Object,
                     columns: string[]=[],
                     load: {children: boolean} = {children: false} ): Model[] {

    const result = query.select(columns).from(this.tableName()).where(filter).run();
    console.table(result);
    if (load.children) {
      const models: Model[] = this.createModelInstances(result);
      models.forEach( (model: Model) => model.getChildrenAll() );
      return models;
    } else {
      return this.createModelInstances(result);
    }
  }

  public getByOperator(termA: any,
                       operator: string,
                       termB: any,
                       columns: string[] = [],
                       load: {children: boolean} = {children: false}): Model[] {

    const result = query.select(columns).from(this.tableName()).where(termA, operator, termB).run();
    console.table(result);
    if (load.children) {
      const models: Model[] = this.createModelInstances(result);
      models.forEach( (model: Model) => model.getChildrenAll() );
      return models;
    } else {
      return this.createModelInstances(result);
    }
  }

  private hasRelations(): boolean {
    return this.model.prototype.hasMany
  }

  private createColumnRelation(index: number): void {
    const model = this.model;
    const relatedModel = model.prototype.hasMany()[index];
    const newColumnRelation = new Column({
      name: model.name.toLowerCase() + '_id',
      dbType: DBtype.INTEGER,
      foreignKey: true,
      relatedTable: model.name.toLowerCase() + 's',
      notNullable: true
    });
    const logFormat = 'color: grey; border-color: lightgrey; border-style: solid; border-width: 1px; ' +
      'border-radius: 2px; padding: 2px; background-color: #f0f0f5';
    console.log(`%c ⚿ Foreign-key column created in table ${relatedModel.prototype.tableName()}: `, logFormat);
    console.log(newColumnRelation);
    const relatedModelColumns = relatedModel.prototype.constructor.columns;
    relatedModelColumns.push(newColumnRelation);
  }

  private createRelations(): void {
    const relationsList: Model[] = this.model.prototype.hasMany();
    for(let index = 0; index < relationsList.length; index++) {
      this.createColumnRelation(index);
    }
  }

  /**
   * Get table structure and metadata for a model
   * @param modelClass
   * @returns {Object[]} Column metadata
   */
  public static getTableSchema(modelClass: any): Object[] {
    return db.execQuery( `PRAGMA table_info(${modelClass.prototype.tableName()})` );
  }

  /**
   * Get Knex query-builder for this collection/table
   * @returns {any}
   */
  public query(): any {
    return query(this.tableName());
  }

  /**
   * Returns table schema with column metadata
   * @param {string} tableName
   * @param {string} columnName
   * @returns {boolean}
   */
  public static hasColumn(tableName: string, columnName: string): boolean {
    const results = db.exec(`SELECT COUNT(*) AS MATCHED_COLUMNS 
      FROM pragma_table_info('${tableName}') WHERE name='${columnName}'`);
    return results[0].values[0][0] > 0;
  }

  /**
   * For posible future use
   * Deletes the table corresponding to the collection
   * @param {"string"} tableName
   */
  public static deleteTable(tableName: string): void {
    db.runQuery( query.schema.dropTableIfExists(tableName) );
  }

}