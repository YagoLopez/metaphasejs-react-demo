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
var NotSavedModelError = /** @class */ (function (_super) {
    __extends(NotSavedModelError, _super);
    function NotSavedModelError(model, relatedModel) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.relatedModel = relatedModel;
        var relatedModelName;
        if (relatedModel.constructor.name === "Function") {
            relatedModelName = relatedModel.prototype.constructor.name;
        }
        else {
            relatedModelName = relatedModel.constructor.name;
        }
        var msg = "(" + model.constructor.name + ") = " + JSON.stringify(model) +
            (" must be saved to establish a relation with (" + relatedModelName + ")");
        throw new Error(msg);
        return _this;
    }
    return NotSavedModelError;
}(Error));
export { NotSavedModelError };
var InvalidPropTypeError = /** @class */ (function (_super) {
    __extends(InvalidPropTypeError, _super);
    function InvalidPropTypeError(jsType) {
        var _this = _super.call(this) || this;
        var msg = "Invalid model property type: \"" + jsType + "\". Allowed values: [\"string, number\"]";
        throw new Error(msg);
        return _this;
    }
    return InvalidPropTypeError;
}(Error));
export { InvalidPropTypeError };
var InvalidColumnData = /** @class */ (function (_super) {
    __extends(InvalidColumnData, _super);
    function InvalidColumnData(columnData) {
        var _this = _super.call(this) || this;
        var msg = "Invalid column data value: \"" + columnData + "\"";
        throw new Error(msg);
        return _this;
    }
    return InvalidColumnData;
}(Error));
export { InvalidColumnData };
//# sourceMappingURL=exceptions.js.map