//todo: funcionamiento para tipo de columna boolean. Poder usar "true/false"
//todo: poder obtener una columna de la tabla de un modelo y hacerla nullable (para los casos en que
// se quiera hacer la columna fk nullable
//todo: hacer configurable politica de acciones: cascade, set null, etc.

import {DBtype} from "./types";
import {TableBuilder} from "knex";
import {InvalidColumnData} from "./exceptions";

export const enum ColumnAction {
  Cascade = 'cascade',
  SetNull = 'set null',
  SetDefault = 'set default',
  Restrict = 'restrict',
  NoAction = 'no action'
}

export interface IColumn {
  name?: string;
  dbType?: DBtype;
  size?: number;
  foreignKey?: boolean;
  relatedTable?: string;
  unique?: boolean;
  defaultValue?: any;
  notNullable?: boolean;
  index?: boolean;
}

export class Column implements IColumn {
  name?: string;
  dbType?: DBtype;
  size?: number;
  foreignKey?: boolean;
  relatedTable?: string;
  unique?: boolean;
  defaultValue?: any;
  notNullable?: boolean;
  index?: boolean;

  //todo: sqlite no soporta default values (solo null) eliminar la opcion "defaultValue"
  //`sqlite` does not support inserting default values. Specify values explicitly or use the `useNullAsDefault`
  // config flag. (see docs http://knexjs.org/#Builder-insert).

  constructor({name, size, dbType, foreignKey, relatedTable, unique, defaultValue, notNullable, index}: IColumn) {
    this.name = name;
    this.dbType = dbType;
    this.foreignKey = foreignKey;
    this.relatedTable = relatedTable;
    this.unique = unique;
    this.defaultValue = defaultValue;
    this.size = size;
    this.notNullable = notNullable;
    this.index = index;
  }

  /**
   * Creates foreign key relation between two columns in two tables
   * Column 1: primary key column ('id')
   * Column 2: foreign key column (<modelName>_id)
   * Table 1: table
   * Table 2: this.relatedTable
   * Note: ColumnAction = 'Cascade' by default. Not configurable by now
   * @param {knex.TableBuilder} table
   */
  public createColumnsRelation(table: TableBuilder) {

    if (!this.name) {
      throw new InvalidColumnData(this.name);
    }

    if (!this.relatedTable) {
      throw new InvalidColumnData(this.relatedTable);
    }

    table
      .foreign(this.name)
      .references('id')
      .inTable(this.relatedTable)
      .onDelete(ColumnAction.Cascade)
      .onUpdate(ColumnAction.Cascade);
  }

  /**
   * Create table columns based in column properties
   * @param {Knex.TableBuilder} table
   */
  public createColumn(table: TableBuilder) {

    let newColumn;
    const colType = this.dbType;
    const colName = this.name;
    const colSize = this.size;

    this.size && console.warn('Size option exists for compatibility. It has no real effect');

    if (!colType || !colName) {
      throw new InvalidColumnData(colType || colName);
    }
    if (this.foreignKey) {
      this.createColumnsRelation(table);
    }
    if (this.notNullable) {
      newColumn = table[colType](colName).notNullable();
    }
    if (this.unique) {
      newColumn = Column.addUniqueConstraint(newColumn, table, colType, colName);
    }
    if (this.index) {
      newColumn = Column.addIndex(newColumn, table, colType, colName);
    }
    return newColumn || table[colType](colName, colSize);
  }

  private static addUniqueConstraint(newColumn: any,
                                     tableBuilder: TableBuilder, colType: DBtype, colName: string): TableBuilder {
    if(newColumn) {
      return newColumn.unique();
    } else {
      return tableBuilder[colType](colName).unique();
    }
  }

  private static addIndex(newColumn: any,
                          tableBuilder: TableBuilder, colType: DBtype, colName: string): TableBuilder {
    if(newColumn) {
      return newColumn.index();
    } else {
      return tableBuilder[colType](colName).index();
    }
  }

  public isForeignKey(): boolean {
    return Boolean(this.foreignKey);
  }
}