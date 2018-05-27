var knex = require('knex');
import { db } from "./database";
var queryBuilder;
if (process.env.NODE_ENV !== 'test') {
    /**
     * Query-Builder: creates sql query strings using functions
     * @type {Knex}
     */
    queryBuilder = knex({
        client: 'sqlite',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
        database: 'metaphase_db'
    });
}
if (process.env.NODE_ENV === 'test') {
    var mockKnex = require('mock-knex');
    /**
     * Mocked query-builder for tests
     * @type {Knex}
     */
    queryBuilder = knex({
        client: 'sqlite',
        debug: false,
        useNullAsDefault: true,
        database: 'test_db'
    });
    mockKnex.mock(queryBuilder);
}
//todo: emitir un evento personalizado para saber cuando se ha ejecutado una consulta
/**
 * Execute database query using query-builder
 * Do not use arrow function because "this" type is incorrectly infered by typescript
 * @return {Object[]} list with query results
 */
queryBuilder().__proto__.run = function () {
    return db.execQuery(this);
};
/**
 * Execute database query using query-builder and return only first row
 * @return {Object} query result
 */
queryBuilder().__proto__.getOne = function () {
    return db.execQuery(this)[0];
};
export { queryBuilder as query };
//# sourceMappingURL=query.builder.js.map