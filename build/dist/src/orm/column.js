//todo: funcionamiento para tipo de columna boolean. Poder usar "true/false"
//todo: poder obtener una columna de la tabla de un modelo y hacerla nullable (para los casos en que
// se quiera hacer la columna fk nullable
//todo: hacer configurable politica de acciones: cascade, set null, etc.
import { InvalidColumnData } from "./exceptions";
var Column = /** @class */ (function () {
    //todo: sqlite no soporta default values (solo null) eliminar la opcion "defaultValue"
    //`sqlite` does not support inserting default values. Specify values explicitly or use the `useNullAsDefault`
    // config flag. (see docs http://knexjs.org/#Builder-insert).
    function Column(_a) {
        var name = _a.name, size = _a.size, dbType = _a.dbType, foreignKey = _a.foreignKey, relatedTable = _a.relatedTable, unique = _a.unique, defaultValue = _a.defaultValue, notNullable = _a.notNullable, index = _a.index;
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
    Column.prototype.createColumnsRelation = function (table) {
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
            .onDelete("cascade" /* Cascade */)
            .onUpdate("cascade" /* Cascade */);
    };
    /**
     * Create table columns based in column properties
     * @param {Knex.TableBuilder} table
     */
    Column.prototype.createColumn = function (table) {
        var newColumn;
        var colType = this.dbType;
        var colName = this.name;
        var colSize = this.size;
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
    };
    Column.addUniqueConstraint = function (newColumn, tableBuilder, colType, colName) {
        if (newColumn) {
            return newColumn.unique();
        }
        else {
            return tableBuilder[colType](colName).unique();
        }
    };
    Column.addIndex = function (newColumn, tableBuilder, colType, colName) {
        if (newColumn) {
            return newColumn.index();
        }
        else {
            return tableBuilder[colType](colName).index();
        }
    };
    Column.prototype.isForeignKey = function () {
        return Boolean(this.foreignKey);
    };
    return Column;
}());
export { Column };
//# sourceMappingURL=column.js.map