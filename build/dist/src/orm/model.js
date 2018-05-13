var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Base } from "./base";
import { query } from "./query.builder";
import { NotSavedModelError } from "./exceptions";
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model(props) {
        var _this = _super.call(this) || this;
        Object.assign(_this, props);
        return _this;
    }
    /**
     * Factory for model instance creation
     * @param {Object} pojo (plain old javascript object)
     * @param {any} modelClass
     * @returns {Model}
     */
    Model.create = function (pojo, modelClass) {
        return new modelClass(pojo);
    };
    Model.prototype.isSaved = function () {
        return this.id !== undefined;
    };
    Model.prototype.getForeignKeyColumnName = function () {
        return this.constructor.name.toLowerCase() + '_id';
    };
    //todo: parametro para opcion escribir el modelo en la tabla de la bd {save: true}
    Model.prototype.belongsTo = function (model) {
        if (!model.isSaved) {
            throw new Error('Invalid model instance: ' + model);
        }
        if (!model.isSaved()) {
            throw new NotSavedModelError(model, this);
        }
        var foreignColumnName = model.getForeignKeyColumnName();
        this[foreignColumnName] = model.id;
        return this;
    };
    //todo: esto corresponde a la direccion inversa de una relacion. Igual se podria implementar como un decorator
    //igual que getChildren(). el decorador tendria que crear la fn hasMany() y getParent() o getChildren()
    //dependiendo de lado de la relacion (consultar typeorm para ver como lo hace)
    Model.prototype.getParent = function (model) {
        if (!this.isSaved()) {
            throw new NotSavedModelError(this, model);
        }
        var relatedTable = model.prototype.tableName();
        var fkColumnName = model.prototype.getForeignKeyColumnName();
        var idColValue = this[fkColumnName];
        var relatedModels = query(relatedTable).where('id', idColValue).run();
        return relatedModels.map(function (obj) { return Model.create(obj, model); });
    };
    //todo: intentar crear dinamicamente esta funcion como "posts()" por ejemplo
    /**
     * Get first level related children models
     * @param model
     * @returns {Model[]}
     */
    Model.prototype.getChildren = function (model) {
        if (!this.isSaved()) {
            throw new NotSavedModelError(this, model);
        }
        var childTable = model.prototype.tableName();
        var fkColumnChildTable = this.getForeignKeyColumnName();
        try {
            var relatedModels = query(childTable).where(fkColumnChildTable, this.id).run();
            return relatedModels.map(function (obj) { return Model.create(obj, model); });
        }
        catch (exception) {
            console.error("Model " + JSON.stringify(this) + " has no children of type \"" + model.name + "\"");
            console.error(exception);
            return [];
        }
    };
    /**
     * Get recursively all descendant models from this model
     */
    Model.prototype.getChildrenAll = function () {
        if (this.hasMany) {
            var childClasses = this.hasMany();
            for (var i = 0; i < childClasses.length; i++) {
                var childModels = this.getChildren(childClasses[i]);
                var newPropName = childClasses[i].prototype.tableName();
                this[newPropName] = [];
                for (var j = 0; j < childModels.length; j++) {
                    this[newPropName].push(childModels[j]);
                    childModels[j].getChildrenAll(); // recursive call
                }
            }
        }
    };
    //todo: testar esta fn
    /**
     * Makes related models properties not enumerable
     * Use: if a model is fetched with all related (or children) models
     * when this model is saved an error is thrown due to properties containing related models
     * are not original model properties
     * This function can be used to "hide" (not enumerate) these props and save the model
     * @param {Model} model
     * returns {Model}
     */
    Model.omitChildrenProps = function (model) {
        model.hasChildren() && model.hasMany().forEach(function (relatedModel) {
            try {
                Object.defineProperty(model, relatedModel.prototype.tableName(), { enumerable: false });
            }
            catch (exception) {
                console.error(exception);
                alert(exception);
            }
        });
        return model;
    };
    Model.prototype.hasChildren = function () {
        return this.hasMany !== undefined;
    };
    return Model;
}(Base));
export { Model };
//# sourceMappingURL=model.js.map