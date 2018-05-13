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
import { Calendar } from 'primereact/components/calendar/Calendar';
import { query } from "../orm/query.builder";
var DialogComment = /** @class */ (function (_super) {
    __extends(DialogComment, _super);
    function DialogComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DialogComment.prototype.componentDidMount = function () {
        setReadonlyAttr('post_id');
    };
    DialogComment.prototype.componentWillUpdate = function () {
        var modelIds = query.select('id').from('posts').run();
        this.postIds = modelIds.map(function (userIdObj) {
            return { label: userIdObj.id.toString(), value: userIdObj.id };
        });
    };
    DialogComment.prototype.onPostIdChange = function (value) {
        var selectedModel = __assign({}, this.state.selectedModel);
        selectedModel.post_id = value;
        this.setState({ selectedModel: selectedModel });
    };
    DialogComment.prototype.onDateChange = function (value) {
        var getDateFormated = function (dateObj) {
            return dateObj.getMonth() + 1 + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
        };
        var selectedModel = __assign({}, this.state.selectedModel);
        try {
            selectedModel.date = getDateFormated(value);
            this.setState({ selectedModel: selectedModel });
        }
        catch (error) {
            console.warn(error);
            alert('Error parsing date format');
        }
    };
    DialogComment.prototype.render = function () {
        var _this = this;
        var _a = this.state, selectedModel = _a.selectedModel, displayDialog = _a.displayDialog;
        var footerDialog = (React.createElement("div", { className: "ui-dialog-buttonpane ui-helper-clearfix" },
            React.createElement(Button, { icon: "fa-close", label: "Cancel", onClick: function (_) { return _this.onBtnCancel(); } }),
            React.createElement(Button, { label: "Save", icon: "fa-check", onClick: function (_) { return _this.onBtnSave(); } })));
        return (React.createElement(Dialog, { visible: displayDialog, header: "Edit Row", modal: true, responsive: false, footer: footerDialog, onHide: function () { return _this.setState({ displayDialog: false }); } },
            React.createElement("div", { className: "ui-grid ui-grid-responsive ui-fluid" },
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "author" }, "Author")),
                    React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                        React.createElement(InputText, { id: "author", onChange: function (e) { _this.updateProperty('author', e.target.value); }, value: selectedModel ? selectedModel.author : '' }))),
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "date" }, "Date [mm/dd/yy]")),
                    React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                        React.createElement(Calendar, { value: selectedModel ? new Date(selectedModel.date) : '', id: "date", readOnlyInput: true, monthNavigator: true, showIcon: true, onChange: function (e) { return _this.onDateChange(e.value); } }))),
                React.createElement("div", { className: "ui-grid-row" },
                    React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                        React.createElement("label", { htmlFor: "post_id" }, "Post Id")),
                    React.createElement("div", { className: "dialog-label" },
                        React.createElement(Dropdown, { value: selectedModel ? selectedModel.post_id : '', id: "post_id", options: this.postIds, onChange: function (e) { return _this.onPostIdChange(e.value); }, className: "dropdown", placeholder: "Post Id" }))))));
    };
    return DialogComment;
}(DialogBase));
export { DialogComment };
//# sourceMappingURL=DialogComment.js.map