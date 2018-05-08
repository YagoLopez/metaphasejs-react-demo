import { db } from "./database";
import { Collection } from "./collection";
import { query } from "./query.builder";
import { logQuery } from "./yago.logger";
var Base = /** @class */ (function () {
    function Base() {
    }
    Base.prototype.tableName = function () {
        var name;
        if (this.model) {
            name = this.model.name;
        }
        else {
            name = this.constructor.name;
        }
        return name.toLowerCase() + 's';
    };
    Base.prototype.insert = function (model) {
        model = model || this;
        query.insert(model).into(this.tableName()).run();
        model.id = Collection.getIdLastRecordInserted();
        return model.id;
    };
    Base.prototype.update = function (model) {
        query.table(this.tableName()).update(model).where('id', model.id).run();
        return model.id;
    };
    Base.prototype.save = function (model) {
        model = model || this;
        var idModelSaved;
        if (model.isSaved()) {
            idModelSaved = this.update(model);
        }
        else {
            idModelSaved = this.insert(model);
        }
        (idModelSaved > 0) && logQuery("Saved " + model.constructor.name + " with id: " + idModelSaved, 'result');
        return idModelSaved;
    };
    Base.prototype.remove = function (model) {
        model = model || this;
        var deleteQuery = "delete from " + this.tableName() + " where id=" + model.id;
        db.run(deleteQuery);
        logQuery(deleteQuery, 'query');
        logQuery("Deleted " + this.constructor.name + " with id: " + model.id, 'result');
        return model.id;
    };
    return Base;
}());
export { Base };
//# sourceMappingURL=base.js.map