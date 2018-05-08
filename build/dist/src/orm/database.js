var sql = require('sql.js');
import { logQuery } from './yago.logger';
var FileSaver = require('file-saver');
export var FILE_NAME = 'test2.sqlite';
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
export var db = new sql.Database();
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
db.__proto__.runQuery = function (query) {
    var queryString = query.toString();
    logQuery(queryString, 'query');
    return db.run(queryString);
};
db.__proto__.execQuery = function (query) {
    logQuery(query.toString(), 'query');
    return db.getResults(db.prepare(query.toString()));
};
db.__proto__.getResults = function (statement) {
    var result = [];
    while (statement.step()) {
        result.push(statement.getAsObject());
    }
    statement.free();
    return result;
};
db.__proto__.hasTable = function (tableName) {
    var result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='" + tableName + "'");
    return result && result.length > 0;
};
db.__proto__.execFunction = function (fnExpression) {
    var stmt = db.prepare(fnExpression);
    var result = db.getResults(stmt);
    stmt.free();
    return result;
};
db.__proto__.integrityCheck = function () {
    return db.execFunction('PRAGMA integrity_check');
};
export function loadFromDisk3(fileNamePath) {
    debugger;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileNamePath, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
        debugger;
        var response = this.response;
        var uInt8Array = new Uint8Array(this.response);
        db = new sql.Database(uInt8Array);
        var results = db.exec("select * from users");
        console.log('results', results);
    };
    xhr.send();
}
export function loadFromDisk4(fileNamePath) {
    return fetch(fileNamePath)
        .then(function (response) {
        // debugger
        return response.arrayBuffer();
    }).then(function (arrayBuffer) {
        var uInt8Array = new Uint8Array(arrayBuffer);
        db = new sql.Database(uInt8Array);
        var results = db.exec("select * from users");
        console.log('results', results);
    })
        .catch(function (error) {
        console.error(error);
    });
}
export var saveToDisk = function (fileNamePath) {
    try {
        var isFileSaverSupported = !!new Blob;
    }
    catch (exception) {
        alert('Save file to disk not supported by browser');
        console.error(exception);
    }
    var uint8Array = db.export();
    var buffer = new Buffer(uint8Array);
    var file = new File([buffer], fileNamePath, { type: 'application/octet-stream' });
    FileSaver.saveAs(file);
};
//todo: eliminar esta funcion (?). Se usa para obtener resultado de consulta como con "run()" pero usando "modify()"
// export function rows(queryBuilder: any): any {
//   queryBuilder.result = db.execQuery(queryBuilder);
// }
//# sourceMappingURL=database.js.map