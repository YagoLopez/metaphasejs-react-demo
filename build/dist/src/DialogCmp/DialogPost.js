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
import { query } from "../orm/query.builder";
import { setReadOnlyAttr } from "../utils";
var DialogPost = /** @class */ (function (_super) {
    __extends(DialogPost, _super);
    function DialogPost() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DialogPost.prototype.componentDidMount = function () {
        setReadOnlyAttr('user_id');
    };
    DialogPost.prototype.componentWillUpdate = function () {
        var modelIds = query.select('id').from('users').run();
        this.userIds = modelIds.map(function (userIdObj) {
            return { label: userIdObj.id.toString(), value: userIdObj.id };
        });
    };
    DialogPost.prototype.onUserIdChange = function (value) {
        var selectedModel = __assign({}, this.state.selectedModel);
        selectedModel.user_id = value;
        this.setState({ selectedModel: selectedModel });
    };
    DialogPost.prototype.render = function () {
        var _this = this;
        var _a = this.state, selectedModel = _a.selectedModel, displayDialog = _a.displayDialog;
        var dialogName = selectedModel && selectedModel.constructor.name;
        var footerDialog = (React.createElement("div", { className: "ui-dialog-buttonpane ui-helper-clearfix" },
            React.createElement(Button, { icon: "fa-close", label: "Cancel", onClick: function (_) { return _this.onBtnCancel(); } }),
            React.createElement(Button, { label: "Save", icon: "fa-check", onClick: function (_) { return _this.onBtnSave(); } })));
        return (React.createElement(Dialog, { visible: displayDialog, header: "Edit  " + dialogName, modal: true, responsive: false, footer: footerDialog, onHide: function () { return _this.setState({ displayDialog: false }); } },
            React.createElement("div", { className: "ui-grid ui-grid-responsive ui-fluid" },
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "title" }, "Title")),
                    React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                        React.createElement(InputText, { id: "title", onChange: function (e) { _this.updateProperty('title', e.target.value); }, value: selectedModel ? selectedModel.title : '' }))),
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "content" }, "Content")),
                    React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                        React.createElement(InputText, { id: "content", onChange: function (e) { _this.updateProperty('content', e.target.value); }, value: selectedModel ? selectedModel.content : '' }))),
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "user_id" }, "User Id")),
                    React.createElement("div", { className: "dialog-label" },
                        React.createElement(Dropdown, { value: selectedModel ? selectedModel.user_id : '', id: "user_id", options: this.userIds, onChange: function (e) { return _this.onUserIdChange(e.value); }, className: "dropdown", placeholder: "User Id" }))))));
    };
    return DialogPost;
}(DialogBase));
export { DialogPost };
//# sourceMappingURL=DialogPost.js.map