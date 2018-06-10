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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import { Dialog } from "primereact/components/dialog/Dialog";
import { DialogBase } from "./DialogBase";
import { InputText } from "primereact/components/inputtext/InputText";
import { Dropdown } from "primereact/components/dropdown/Dropdown";
import { Button } from "primereact/components/button/Button";
import * as NumericInput from "react-numeric-input";
import { setReadOnlyAttr } from "../utils";
var DialogUser = /** @class */ (function (_super) {
    __extends(DialogUser, _super);
    function DialogUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DialogUser.prototype.onIsAdminChange = function (value) {
        var selectedModel = __assign({}, this.state.selectedModel);
        selectedModel.admin = value;
        this.setState({ selectedModel: selectedModel });
    };
    DialogUser.prototype.componentDidMount = function () {
        // Avoids to show virtual keyboard in smartphones
        setReadOnlyAttr('#admin > div > input');
        setReadOnlyAttr('#age');
    };
    DialogUser.prototype.render = function () {
        var _this = this;
        var _a = this.state, selectedModel = _a.selectedModel, displayDialog = _a.displayDialog;
        var isAdminOptions = [{ label: 'True', value: 1 }, { label: 'False', value: 0 }];
        var footerDialog = (React.createElement("div", { className: "ui-dialog-buttonpane ui-helper-clearfix" },
            React.createElement(Button, { icon: "fa-close", label: "Cancel", onClick: function (_) { return _this.onBtnCancel(); } }),
            React.createElement(Button, { label: "Save", icon: "fa-check", onClick: function (_) { return _this.onBtnSave(); } })));
        return (React.createElement(Dialog, { visible: displayDialog, header: "User", modal: true, responsive: false, footer: footerDialog, onHide: function () { return _this.setState({ displayDialog: false }); } },
            React.createElement("div", { className: "ui-grid ui-grid-responsive ui-fluid" },
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "name" }, "Name")),
                    React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                        React.createElement(InputText, { id: "name", autoComplete: "off", autoCapitalize: "off", autoCorrect: "off", spellCheck: false, onChange: function (e) { _this.updateProperty('name', e.target.value); }, value: selectedModel ? selectedModel.name : '' }))),
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "age" },
                            "Age ",
                            React.createElement("div", { className: "dialog-small" }, "(1 to 100)"))),
                    React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                        React.createElement(NumericInput, { id: "age", mobile: true, min: 1, max: 100, strict: true, onChange: function (age) { _this.updateProperty('age', age); }, value: selectedModel && selectedModel.age }))),
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "admin" }, "Admin")),
                    React.createElement("div", { className: "dialog-label" },
                        React.createElement(Dropdown, { value: selectedModel ? selectedModel.admin : '', id: "admin", options: isAdminOptions, onChange: function (e) { return _this.onIsAdminChange(e.value); }, className: "dropdown", placeholder: "Is Admin?" }))))));
    };
    return DialogUser;
}(DialogBase));
export { DialogUser };
//# sourceMappingURL=DialogUser.js.map