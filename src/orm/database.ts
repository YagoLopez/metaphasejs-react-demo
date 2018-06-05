//todo: usar whatg-fetch en lugar de fetch para compatibilidad navegador
const sql = require('sql.js');
import {QueryBuilder} from 'knex';
import {logQuery} from './yago.logger';
const FileSaver = require('file-saver');

declare const SQL: any;

//todo: falta completar definicion de tipos para clase Statement y documentar cada metodo
/** **************************************************************************************************************
 * db.js API
 * Documentation:
 * http://kripken.github.io/sql.js/documentation/#http://kripken.github.io/sql.js/documentation/class/Database.html
 **************************************************************************************************************** */
export interface db {

  /**
   * Open a new database either by creating a new one or opening an existing one,
   * stored in the byte array passed in first argument
   * @param {number[]} data
   */
  constructor(data: number[]): void;

  /**
   * Set DB created from external file
   * @param {db} database
   */
  setDatabase(database: db): void;

  /**
   * Runs a database query that can be created by the query builder or by a sql query string.
   * It does not return a list of results. It returns a "db" database object for fn chaining
   * It wraps db.run()
   * @param {Object | string} query
   */
  runQuery(query: QueryBuilder | string): any;

  /**
   * Execute a query against database and returns an array of objects
   * It wraps db.exec()
   * @param {QueryBuilder} query object
   * @returns {Object[]} List of models
   */
  execQuery(query: QueryBuilder | string): Object[];

  /**
   * Get the results from a query and transform them into a list of POJOs
   * @param statement Prepared SQL statement
   * @returns {Object[]}
   */
  getResults(statement: any): Object[];

  /**
   * Check whether a table exists in the database
   * @param {string} tableName
   * @returns {boolean}
   */
  hasTable(tableName: string): boolean;

  /**
   * Check databse integrity (for posible errors and corruption)
   * @returns {Object[]} with integrity info
   */
  integrityCheck(): Object[];

  /**
   * Get DDL (Data Definition Language) queries
   * Useful for debugging purposes
   * @return {Object[]}
   */
  getSchema(): Object[];

  /**
   * Execute SQLite function
   * @param {string} fnExpression
   * @returns {any}
   */
  execFunction(fnExpression: string): any;

  /**
   * Get id of last record inserted in database
   * @return {number}
   */
  getIdLastRecordInserted(): number;

  run(sqlQuery: string, params?: object | any[]): db;
  exec(sqlQuery: string): Array<{columns: string[], values: any[]}>;
  prepare(sqlQuery: string, params?: object | any[]): Object;
  each(sqlQuery: string, callback: Function, done: Function, params?: object | any[]): db;
  export(): Uint8Array;
  close(): void;
  getRowsModified(): number;
  create_function(name: string, fn: Function): void;
}



/**
 * Database instance
 * @type {SQL} Global variable created by 'sql.js'
 */
export let db = new sql.Database();

db.__proto__.setDatabase = (database: any) => {
  db = database;
};

db.__proto__.runQuery = (query: QueryBuilder | string): any => {
  const queryString = query.toString();
  logQuery(queryString, 'query');
  return db.run(queryString);
};

db.__proto__.execQuery = (query: QueryBuilder | string): Object[] => {
  logQuery(query.toString(), 'query');
  return db.getResults( db.prepare(query.toString()) );
};

db.__proto__.getResults = (statement: any): Object[] => {
  let result: any[] = [];
  while (statement.step()){
    result.push(statement.getAsObject());
  }
  statement.free();
  return result;
};

db.__proto__.hasTable = (tableName: string): boolean => {
  const result = db.exec( `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'` );
  return result && result.length > 0
};

db.__proto__.execFunction = (fnExpression: string) => {
  const stmt = db.prepare(fnExpression);
  const result = db.getResults(stmt);
  stmt.free();
  return result;
};

db.__proto__.integrityCheck = (): Object[] => {
  return db.execFunction('PRAGMA integrity_check')
};

db.__proto__.getSchema = () => {
  return db.execQuery('SELECT "name", "sql" FROM "sqlite_master" WHERE type="table"');
};

db.__proto__.getIdLastRecordInserted = (): number => {
  const result = db.execFunction('select last_insert_rowid()');
  return result && result[0]['last_insert_rowid()'];
};

export const loadDbFromFile = (fileNamePath: string, actionFn: Function): void => {
  fetch(fileNamePath)
    .then((response: any) => {
      if (response) {
        return response.arrayBuffer();
      }
    }).then((arrayBuffer: any) => {
    if (arrayBuffer) {
      const dbFile = new Uint8Array(arrayBuffer);
      const dbInstance = new SQL.Database(dbFile);
      db.setDatabase(dbInstance);
      try {
        db.integrityCheck();
      } catch (exception) {
        alert(`Database file not found: "${fileNamePath}"`);
      }
      console.clear();
      const logFormat = 'background: cornflowerblue; color: white; font-weight: ';
      console.log(`%c Database loaded from file "${fileNamePath}" `, logFormat);
      db.execQuery('PRAGMA foreign_keys=ON;');
      actionFn();
    }
  })
  .catch((error: Error) => {
    console.error(error);
    alert('Failed to fetch database file');
  })
};

export const saveDbToFile = (fileNamePath: string) => {
  try {
    const isFileSaverSupported = !!new Blob;
    const uint8Array = db.export();
    const buffer = new Buffer(uint8Array);
    const file = new File([buffer], fileNamePath, {type: 'application/octet-stream'});
    FileSaver.saveAs(file);
  } catch (exception) {
    alert('Save file to disk not supported by browser');
    console.error(exception);
  }
};

console.clear();

