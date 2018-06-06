import "reflect-metadata";
import {Column} from "./column";
import {DBtype} from "./types";
import {InvalidPropTypeError} from "./exceptions";


export function column(colData?:
                       {dbType?: DBtype, size?: number, unique?: boolean, notNullable?: boolean, index?: boolean}) {

  return function (target: any, propName: string) {

    let dbType: DBtype;
    const propType = Reflect.getMetadata("design:type", target, propName);

    target.constructor.columns = target.constructor.columns || [];

    //todo: de la misma forma que se añade una propiedad "columns" al constructor del modelo
    //se podria añadir una funcion "hasMany()" usando un decorator para definir relaciones entre modelos
    //Por ejemplo @hasMany()Post podria generar target.constructor.hasMany([Post])

    if (propType) {
      dbType = getDBTypeFromPropType(propType.name);
    } else {
      throw new InvalidPropTypeError(propType);
    }

    target.constructor.columns.push(new Column(
      {
        name: propName,
        dbType: colData && colData.dbType || dbType,
        size: colData && colData.size,
        unique: colData && colData.unique,
        notNullable: colData && colData.notNullable,
        index: colData && colData.index
      })
    )
  }
}

/**
 * Calculate SQLite type from javascript model prop type.
 *
 * Type correspondence:
 * ---------------------------------
 * Javascript type	  SQLite type
 * ---------------------------------
 * number	            REAL, INTEGER
 * boolean            INTEGER
 * string	            TEXT
 * Array              Uint8Array BLOB
 * null	              NULL
 * ----------------------------------
 * Ref.: https://www.sqlite.org/datatype3.html
 *
 * @param jsPropType JavaScript type
 * @return DBtype SQLite type
 */
export function getDBTypeFromPropType(jsPropType?: string): DBtype {

  jsPropType = jsPropType && jsPropType.toLowerCase();
  let result: DBtype;

  if(jsPropType === 'string') {
    result = DBtype.STRING;
  } else if(jsPropType === 'number') {
    result = DBtype.INTEGER;
  } else if(jsPropType === 'null') {
    result = DBtype.NULL;
  } else {
    throw new InvalidPropTypeError(jsPropType);
  }
  return result;
}