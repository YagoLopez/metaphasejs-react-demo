//todo: en la linea que dice que los datos han sido cargados desde codigo poner enlace a dialogo codigo
//todo: arreglar spinner en dialogo user para que no aparezca teclado virtual
//todo: reducir tamaño bundle quitando dependencias no usadas
//todo: hacer prueba ejectando config crat
//todo: preparar proyecto libreria npm
//todo: opcion para salvar db state a localstorage
//todo: separador de mensajes de logger
//todo: smoke tests
//todo: probar en iexplorer. (avisar de navegador no soportado)
//todo: documentar api con typedoc
//todo: probar a pasar el estado como props de tipo array. Ejm: store = {users: users.getAll(), posts: posts.getAll()}
//todo: dynamic/async import para cargar el contenido del dialogo de codigo
//todo: considerar el uso de polyfills como core-js
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
import { saveDbToFile, getUrlParameter, updateQueryStringParameter } from "metaphasejs";
import { users, posts, comments } from "./store";
import { User } from "./models/user";
import { Post } from "./models/post";
import { Comment } from "./models/comment";
import { sampleCode } from "./sample.code";
import ReactJson from 'react-json-view';
import CodeHighlight from 'code-highlight';
import "code-highlight/lib/style.css";
import "highlight.js/styles/atelier-forest-light.css";
import './App.css';
import { Sidebar } from "primereact/components/sidebar/Sidebar";
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Button } from "primereact/components/button/Button";
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';
import { Panel } from 'primereact/components/panel/Panel';
import { DialogUser } from "./DialogCmp/DialogUser";
import { DialogPost } from "./DialogCmp/DialogPost";
import { DialogComment } from "./DialogCmp/DialogComment";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import * as utils from "./utils";
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.SHOW_CHILDREN = true;
        _this.DB_FILENAME = 'metaphase.sqlite';
        _this.state = {
            children: _this.SHOW_CHILDREN,
            selectedModel: undefined,
            displayLeftMenu: false,
            displayDialogCode: false,
            logger: utils.isLoggerEnabled(),
            loadDbFromFile: utils.isLoadDbFromFile(),
        };
        _this.updateState = _this.updateState.bind(_this);
        return _this;
    }
    App.prototype.componentWillMount = function () {
        if (getUrlParameter('logger').toLowerCase() === 'true') {
            this.setState({ logger: true });
        }
        else {
            this.setState({ logger: false });
        }
    };
    App.prototype.componentDidMount = function () {
        utils.removeElementFromDom('loader');
    };
    App.prototype.updateState = function () {
        this.forceUpdate();
    };
    App.prototype.showChildren = function () {
        var children = this.state.children;
        // const {users} = this.props;
        this.setState({
            children: !children,
            jsonContent: users.getAll({ children: !children }),
            displayDialogCode: false
        });
    };
    App.prototype.saveDbToDisk = function (e) {
        saveDbToFile(this.DB_FILENAME);
    };
    App.prototype.add = function (model, dialog) {
        this.setState({ selectedModel: model });
        dialog.show();
    };
    App.prototype.btnEdit = function (selectedModel) {
        var _this = this;
        var edit = function () {
            selectedModel.tableName() === 'users' && _this.dialogUser.show();
            selectedModel.tableName() === 'posts' && _this.dialogPost.show();
            selectedModel.tableName() === 'comments' && _this.dialogComment.show();
            _this.setState({ selectedModel: selectedModel });
        };
        return (React.createElement(Button, { onClick: function (_) { return edit(); }, className: "ui-button-info", icon: "fa-edit", title: "Edit" }));
    };
    App.prototype.btnRemove = function (model) {
        var _this = this;
        var remove = function (model) {
            if (model.isSaved()) {
                model.remove();
                _this.updateState();
            }
        };
        return (React.createElement(Button, { onClick: function (_) { return remove(model); }, className: "ui-button-danger", icon: "fa-trash", title: "Delete" }));
    };
    App.prototype.btnBurguer = function () {
        this.setState({ displayLeftMenu: !this.state.displayLeftMenu });
    };
    App.prototype.showCode = function () {
        document.body.style.overflow = 'hidden';
        this.setState({ displayLeftMenu: false, displayDialogCode: true });
    };
    App.prototype.hideCode = function () {
        document.body.style.overflow = 'visible';
        this.setState({ displayLeftMenu: false, displayDialogCode: false });
    };
    App.prototype.switchLogger = function () {
        var logger = this.state.logger;
        this.setState({ logger: !logger });
        if (logger) {
            alert('Logger System Off.\n\nReloading...');
        }
        else {
            alert('Logger System On. Check browser console.\n\nReloading...');
        }
    };
    App.prototype.getUrlAppWithLogger = function () {
        if (this.state.logger) {
            return updateQueryStringParameter(location.href, 'logger', 'true');
        }
        else {
            return updateQueryStringParameter(location.href, 'logger', 'false');
        }
    };
    App.prototype.getUrlAppLoadDbFromDisk = function () {
        if (this.state.loadDbFromFile) {
            return updateQueryStringParameter(location.href, 'dbfile', this.DB_FILENAME);
        }
        else {
            return updateQueryStringParameter(location.href, 'dbfile', '');
        }
    };
    App.prototype.switchDb = function () {
        var loadDbFromFile = this.state.loadDbFromFile;
        this.setState({ loadDbFromFile: !loadDbFromFile });
        if (loadDbFromFile) {
            alert('Loading application state from database created by code...');
        }
        else {
            alert('Loading application state from database file...');
        }
    };
    App.prototype.render = function () {
        var _this = this;
        var _a = this.state, children = _a.children, selectedModel = _a.selectedModel, displayLeftMenu = _a.displayLeftMenu, displayDialogCode = _a.displayDialogCode;
        var defaultUser = new User({ name: '', age: '', admin: 0 });
        var defaultPost = new Post({ title: '', content: '', user_id: 0 });
        var defaultComment = new Comment({ author: '', date: new Date(), post_id: 0 });
        var mapIsAdminValue = function (model) {
            return model.admin ? 'True' : 'False';
        };
        var footerTableUsers = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultUser, _this.dialogUser); } })));
        var footerTablePosts = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultPost, _this.dialogPost); } })));
        var footerTableComments = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultComment, _this.dialogComment); } })));
        var dialogProps = {
            selectedModel: selectedModel,
            updateState: this.updateState,
            children: children
        };
        var JsonViewPanelHeader = (React.createElement("span", null,
            "\u2705 Json State View",
            React.createElement("input", { type: "checkbox", checked: children, onChange: function (_) { return _this.showChildren(); }, className: "checkbox-children" }),
            React.createElement("span", { className: "checkbox-children-label", onClick: function (_) { return _this.showChildren(); } }, "Show Children")));
        var loadStateFromFileMsg = (React.createElement("div", { className: "subtitle" },
            "Application state loaded from file: ",
            React.createElement("a", { href: this.DB_FILENAME, target: "_blank" }, this.DB_FILENAME),
            React.createElement("div", null, "You can download db file and query it uploading it to \"Menu \u00BB Online SQLite Viewer\"")));
        var loadStateFromCodeMsg = (React.createElement("div", { className: "subtitle" }, "Application state loaded from code"));
        return (React.createElement("div", { className: "main-content" },
            React.createElement(Toolbar, null,
                React.createElement("div", { className: "ui-toolbar-group-left" },
                    React.createElement(Button, { icon: "fa-bars", onClick: function (_) { return _this.btnBurguer(); }, className: "btn-menu" })),
                React.createElement("strong", { className: "title" }, "MetaphaseJS Demo")),
            React.createElement(Sidebar, { visible: displayLeftMenu, baseZIndex: 1000000, onHide: function () { return _this.setState({ displayLeftMenu: false }); } },
                React.createElement("h3", null,
                    React.createElement("img", { src: "mp-logo-leftmenu.svg", className: "logo-leftside-menu" }),
                    " MetaphaseJS"),
                React.createElement("a", { href: "javascript:void(0)", className: "left-menu-item", onClick: function (_) { return _this.showCode(); } },
                    React.createElement("i", { className: "fa fa-file-code-o" }),
                    React.createElement("span", null, "Show Code")),
                React.createElement("a", { href: this.getUrlAppWithLogger(), className: "left-menu-item", onClick: function (_) { return _this.switchLogger(); } },
                    React.createElement("i", { className: "fa fa-refresh" }),
                    React.createElement("span", null, "Switch Logger")),
                React.createElement("a", { href: this.getUrlAppLoadDbFromDisk(), className: "left-menu-item", onClick: function (_) { return _this.switchDb(); } },
                    React.createElement("i", { className: "fa fa-refresh" }),
                    React.createElement("span", null, "Switch data origin")),
                React.createElement("a", { href: "javascript:void(0)", className: "left-menu-item", onClick: function (e) { return _this.saveDbToDisk(e); } },
                    React.createElement("i", { className: "fa fa-download" }),
                    React.createElement("span", null, "Save state to file")),
                React.createElement("a", { href: "https://sqliteonline.com", className: "left-menu-item", target: "_blank" },
                    React.createElement("i", { className: "fa fa-external-link" }),
                    React.createElement("span", null, "Online SQLite Viewer")),
                React.createElement("br", null)),
            React.createElement(Sidebar, { fullScreen: true, visible: displayDialogCode, onHide: function () { return _this.hideCode(); } },
                React.createElement("h2", { className: "centered title-border" }, "\u2705 Code View"),
                React.createElement("div", { className: "centered subtitle" }, "Source code for store creation, model definitions and relations"),
                React.createElement(ScrollPanel, { className: "custom code-view-container" },
                    React.createElement(CodeHighlight, { language: "javascript", tab: 2, classes: { code: 'sample-code', pre: 'pre-margin' } }, sampleCode))),
            React.createElement("div", { className: "fade-in-long" },
                React.createElement("div", null, this.state.loadDbFromFile ? loadStateFromFileMsg : loadStateFromCodeMsg),
                React.createElement(Panel, { header: JsonViewPanelHeader, toggleable: true },
                    React.createElement(ScrollPanel, { className: "custom json-view-container" },
                        React.createElement(ReactJson, { ref: function (el) { return _this.reactJsonViewCmp = el; }, src: users.getAll({ children: children }), iconStyle: 'square', name: "USERS", enableClipboard: false, displayDataTypes: false, displayObjectSize: false, theme: 'shapeshifter:inverted' }))),
                React.createElement(Panel, { header: "\u2705 Table State View", toggleable: true },
                    React.createElement(DataTable, { value: users.getAll(), header: "USERS", footer: footerTableUsers, className: "centered" },
                        React.createElement(Column, { field: "id", header: "Id" }),
                        React.createElement(Column, { field: "name", header: "Name", className: "ellipsis" }),
                        React.createElement(Column, { field: "age", header: "Age" }),
                        React.createElement(Column, { field: "admin", header: "Admin", body: function (model) { return mapIsAdminValue(model); } }),
                        React.createElement(Column, { header: "Edit", body: function (model) { return _this.btnEdit(model); } }),
                        React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } })),
                    React.createElement(DataTable, { value: posts.getAll(), header: "POSTS", footer: footerTablePosts, className: "centered" },
                        React.createElement(Column, { field: "id", header: "Id" }),
                        React.createElement(Column, { field: "title", header: "Title" }),
                        React.createElement(Column, { field: "content", header: "Content", className: "ellipsis" }),
                        React.createElement(Column, { field: "user_id", header: "User Id" }),
                        React.createElement(Column, { header: "Edit", body: function (model) { return _this.btnEdit(model); } }),
                        React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } })),
                    React.createElement(DataTable, { value: comments.getAll(), header: "COMMENTS", footer: footerTableComments, className: "centered" },
                        React.createElement(Column, { field: "id", header: "Id" }),
                        React.createElement(Column, { field: "author", header: "Author", className: "ellipsis" }),
                        React.createElement(Column, { field: "date", header: "Date", className: "ellipsis" }),
                        React.createElement(Column, { field: "post_id", header: "Post Id" }),
                        React.createElement(Column, { header: "Edit", body: function (model) { return _this.btnEdit(model); } }),
                        React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } }))),
                React.createElement(Panel, { header: "\u2705 Schema State View (static)", toggleable: true },
                    React.createElement(ScrollPanel, { className: "uml-img-container" },
                        React.createElement("img", { className: "uml-img", src: require("./uml/uml.jpg") })))),
            React.createElement("br", null),
            React.createElement(DialogUser, __assign({ ref: function (el) { return _this.dialogUser = el; } }, dialogProps)),
            React.createElement(DialogPost, __assign({ ref: function (el) { return _this.dialogPost = el; } }, dialogProps)),
            React.createElement(DialogComment, __assign({ ref: function (el) { return _this.dialogComment = el; } }, dialogProps))));
    };
    return App;
}(React.Component));
export { App };
//# sourceMappingURL=App.js.map