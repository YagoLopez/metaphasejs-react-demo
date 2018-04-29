const sql = require('sql.js');
import {QueryBuilder} from 'knex';
import {logQuery} from './yago.logger';
const FileSaver = require('file-saver');



//todo: falta completar definicion de tipos para clase Statement y si acaso documentar cada metodo
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
   * Runs a database query constructed by Knex (the query builder)
   * It does not returns a list of results. It returns db database object for fn chaining
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
   * Get the results from a query and transform them to a list of POJOs
   * @param statement Prepared SQL statement
   * @returns {Object[]}
   */
  getResults(statement: any): Object[];

  /**
   * Check if a table exists in the database
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
   * Execute SQLite function
   * @param {string} fnExpression
   * @returns {any}
   */
  execFunction(fnExpression: string): any;

  run(sqlQuery: string, params?: object | any[]): db;
  exec(sqlQuery: string): Array<{columns: string[], values: any[]}>;
  prepare(sqlQuery: string, params?: object | any[]): Object;
  each(sqlQuery: string, callback: Function, done: Function, params?: object | any[]): db;
  export(): Uint8Array;
  close(): void;
  getRowsModified(): number;
  create_function(name: string, fn: Function): void;

}



export const FILE_NAME: string = 'test2.sqlite';




// fetch(FILE_NAME)
//   .then((response: any) => {
//     debugger
//     if (response) {
//       return response.arrayBuffer();
//     }
//   }).then((arrayBuffer: any) => {
// debugger
//     if (arrayBuffer) {
//       const uInt8Array = new Uint8Array(arrayBuffer);
//       const mydb = new sql.Database(uInt8Array);
//       const results = mydb.exec("select * from users");
//       console.log('results', results);
//       return mydb;
//     } else {
//       return new sql.Database();
//     }
//   })
//   .catch((error: Error) => {
//     console.error(error);
// });




/**
 * Database instance
 * @type {sql.Database}
 */
export let db = new sql.Database();
// export const db;
// export let db: any;



// debugger
// if (FILE_NAME) {
// debugger
//   const xhr = new XMLHttpRequest();
//   xhr.responseType = 'arraybuffer';
//   xhr.open('GET', FILE_NAME, false);
//   xhr.onload = function(e) {
// debugger
//     const response = this.response;
//     const uInt8Array = new Uint8Array(this.response);
//     db = new sql.Database(uInt8Array);
//     const results = db.exec("select * from users");
//     console.log('results', results);
//   };
//   xhr.send();
// } else {
//   db = new sql.Database();
// }







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

export function loadFromDisk3(fileNamePath: string) {
  debugger
  const xhr = new XMLHttpRequest();
  xhr.open('GET', fileNamePath, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    debugger
    const response = this.response;
    const uInt8Array = new Uint8Array(this.response);
    db = new sql.Database(uInt8Array);
    const results = db.exec("select * from users");
    console.log('results', results);
  };
  xhr.send();
}

export function loadFromDisk4(fileNamePath: string) {
  return fetch(fileNamePath)
    .then((response) => {
    // debugger
      return response.arrayBuffer();
    }).then(function (arrayBuffer: any) {
      const uInt8Array = new Uint8Array(arrayBuffer);
      db = new sql.Database(uInt8Array);
      const results = db.exec("select * from users");
      console.log('results', results);
    })
    .catch((error: Error) => {
      console.error(error);
    });
}

export const saveToDisk = (fileNamePath: string) => {
  try {
    const isFileSaverSupported = !!new Blob;
  } catch (exception) {
    alert('Save file to disk not supported by browser');
    console.error(exception);
  }
  const uint8Array = db.export();
  const buffer = new Buffer(uint8Array);
  const file = new File([buffer], fileNamePath, {type: 'application/octet-stream'});
  FileSaver.saveAs(file);
};

//todo: eliminar esta funcion (?). Se usa para obtener resultado de consulta como con "run()" pero usando "modify()"
// export function rows(queryBuilder: any): any {
//   queryBuilder.result = db.execQuery(queryBuilder);
// }

