var sql = require('sql.js');
import { logQuery } from './yago.logger';
var FileSaver = require('file-saver');
/**
 * Database instance
 * @type {SQL} Global variable created by 'sql.js'
 */
export var db = new sql.Database();
db.__proto__.setDatabase = function (database) {
    db = database;
};
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
db.__proto__.getSchema = function () {
    return db.execQuery('SELECT "name", "sql" FROM "sqlite_master" WHERE type="table"');
};
export var loadDbFromFile = function (fileNamePath, actionFn) {
    fetch(fileNamePath)
        .then(function (response) {
        if (response) {
            return response.arrayBuffer();
        }
    }).then(function (arrayBuffer) {
        if (arrayBuffer) {
            var dbFile = new Uint8Array(arrayBuffer);
            var dbInstance = new SQL.Database(dbFile);
            db.setDatabase(dbInstance);
            try {
                db.integrityCheck();
            }
            catch (exception) {
                alert("Database file not found: \"" + fileNamePath + "\"");
            }
            console.clear();
            var logFormat = 'background: cornflowerblue; color: white; font-weight: ';
            console.log("%c Database loaded from file \"" + fileNamePath + "\" ", logFormat);
            db.execQuery('PRAGMA foreign_keys=ON;');
            actionFn();
        }
    })
        .catch(function (error) {
        console.error(error);
    });
};
export var saveDbToFile = function (fileNamePath) {
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
console.clear();
//# sourceMappingURL=database.js.map