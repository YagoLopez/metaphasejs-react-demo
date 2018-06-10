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
import * as React from 'react';
import { removeElementFromDom } from "./utils";
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.prototype.componentDidCatch = function (error, info) {
        removeElementFromDom('loader');
        this.setState({ hasError: true });
        this.error = error.message[0].toUpperCase() + error.message.substring(1);
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            return (React.createElement("div", null,
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "Error"),
                    React.createElement("div", { className: "error" }, "Error loading application"),
                    React.createElement("br", null),
                    React.createElement("div", { className: "centered" }, this.error))));
        }
        else {
            return this.props.children;
        }
    };
    return ErrorBoundary;
}(React.Component));
export { ErrorBoundary };
//# sourceMappingURL=ErrorBoundary.js.map