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
import { Model } from "../../model";
import { Column } from "../../column";
import { Post } from "./post";
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    User.prototype.hasMany = function () {
        return [Post];
    };
    /**
     * In Jest tests, Typescript decorators can not be used. Model properties (table columns) have to be
     * defined as 'Column' Classes
     * @type {[Column]} Columns array
     */
    User.columns = [
        new Column({ name: 'name', dbType: "varchar" /* STRING */, unique: true }),
        new Column({ name: 'age', dbType: "integer" /* INTEGER */, notNullable: true }),
        new Column({ name: 'admin', dbType: "integer" /* BOOLEAN */ })
    ];
    return User;
}(Model));
export { User };
//# sourceMappingURL=user.js.map