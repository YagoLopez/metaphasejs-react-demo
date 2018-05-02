const knex = require('knex');
import {db} from "./database";


let queryBuilder: any;

if (process.env.NODE_ENV !== 'test') {
  /**
   * Query-Builder: it creates sql query strings using functions
   * @type {Knex}
   */
  queryBuilder = knex({
    client: 'sqlite',
    connection: {filename: ':memory:'},
    useNullAsDefault: true,
    database : 'metaphase_db'
  });
}

if (process.env.NODE_ENV === 'test') {
  const mockKnex = require('mock-knex');
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
 * @type {Object[]} list with query results
 */
queryBuilder().__proto__.run = function() {
  return db.execQuery(this);
};

export {queryBuilder as query};
