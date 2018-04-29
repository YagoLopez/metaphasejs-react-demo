export const enum DBtype {
  INTEGER = 'integer',
  REAL = 'real',
  BOOLEAN = 'integer', // SQLite does not admit boolean values natively
  STRING = 'varchar',
  TEXT = 'text',
  DATE = 'varchar',
  BLOB = 'blob',
  NULL = 'null' // null is reserved word
}
