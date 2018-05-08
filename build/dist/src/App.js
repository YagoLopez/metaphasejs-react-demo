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
//todo: por defecto logger = false
//todo: items left side menu: logger = true/false
//todo: feature filtro en el listado de tabla
//todo: diagram view (static)
//todo: al hacer onclick en tableHeader, deberia cambiar el valor de this.state.tableSelected
//todo: poner en cv desarrollo de software con metodologia de tarjetas (kanban?) y Cursos Deep Learning
import * as React from 'react';
import './App.css';
import { Collection } from "./orm/collection";
import { User } from "./models/user";
import { Post } from "./models/post";
import { Comment } from "./models/comment";
import { sampleCode } from "./sample.code";
import ReactJson from 'react-json-view';
// import JSONViewer from 'react-json-viewer';
import CodeHighlight from 'code-highlight';
import "code-highlight/lib/style.css";
import "highlight.js/styles/atelier-forest-light.css";
import { saveToDisk } from "./orm/database";
import { Model } from "./orm/model";
import { Sidebar } from "primereact/components/sidebar/Sidebar";
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Button } from "primereact/components/button/Button";
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { Column } from 'primereact/components/column/Column';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';
import { Panel } from 'primereact/components/panel/Panel';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
// Users -----------------------------------------------------------------
var users = new Collection(User);
var user1 = new User({ name: "user1", age: 11, admin: 1 });
var user2 = new User({ name: "user2", age: 22, admin: 1 });
var user3 = new User({ name: "user3", age: 33, admin: 1 });
users.save(user1);
users.save(user2);
users.save(user3);
// Posts -----------------------------------------------------------------
var posts = new Collection(Post);
var post1 = new Post({ title: 'title post 1', content: 'content post 1' });
var post2 = new Post({ title: 'title post 2', content: 'content post 2' });
var post3 = new Post({ title: 'title post 3', content: 'content post 3' });
post1.belongsTo(user1);
post2.belongsTo(user1);
post3.belongsTo(user2);
posts.save(post1);
posts.save(post2);
posts.save(post3);
// Comments -----------------------------------------------------------------
var comments = new Collection(Comment);
var comment1 = new Comment({ author: 'author1', date: 'date1' });
var comment2 = new Comment({ author: 'author2', date: 'date2' });
comment1.belongsTo(post1);
comment2.belongsTo(post1);
comment1.save();
comment2.save();
// --------------------------------------------------------------------------
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.SHOW_CHILDREN = true;
        var usersList = users.getAll({ children: _this.SHOW_CHILDREN });
        var postsList = posts.getAll({ children: _this.SHOW_CHILDREN });
        _this.state = {
            children: _this.SHOW_CHILDREN,
            jsonContent: usersList,
            tableSelected: 'USERS',
            users: usersList,
            posts: postsList,
            selectedModel: undefined,
            displayDialog: false,
            displayLeftMenu: false,
            displayDialogFullScreen: false
        };
        return _this;
    }
    App.prototype.componentDidMount = function () {
        //todo: cargar aqui la base de datos desde un fichero mediante peticion xmlhttp
        // this.carservice.getCarsSmall().then(data => this.setState({cars: data}));
    };
    //todo: revisar esto para ver lo de las propiedades fantasmas
    App.prototype.updateState = function () {
        var children = this.state.children;
        var usersList = users.getAll({ children: children });
        var postsList = posts.getAll({ children: children });
        if (this.state.tableSelected === 'USERS') {
            this.setState({ jsonContent: usersList });
        }
        if (this.state.tableSelected === 'POSTS') {
            this.setState({ jsonContent: postsList });
        }
        this.setState({ users: usersList, posts: postsList });
    };
    App.prototype.showChildren = function () {
        // debugger
        var _a = this.state, children = _a.children, tableSelected = _a.tableSelected;
        if (tableSelected === 'USERS') {
            this.setState({
                children: !children,
                jsonContent: users.getAll({ children: !children })
            });
        }
        if (tableSelected === 'POSTS') {
            this.setState({
                children: !children,
                jsonContent: posts.getAll({ children: !children })
            });
        }
    };
    App.prototype.loadDbFromDisk = function (e) {
        // debugger
        //     const xhr = new XMLHttpRequest();
        //     xhr.open('GET', 'test2.sqlite', true);
        //     xhr.responseType = 'arraybuffer';
        //     xhr.onload = function(e) {
        // debugger
        //       const response = this.response;
        //       const uInt8Array = new Uint8Array(this.response);
        //       let db2 = db;
        //       db2 = new sql.Database(uInt8Array);
        //       const results = db2.exec("select * from users");
        //       console.log('results', results);
        //     };
        //     xhr.send();
    };
    App.prototype.saveDbToDisk = function (e) {
        saveToDisk('test3.sqlite');
    };
    App.prototype.add = function (model) {
        this.setState({ selectedModel: model, displayDialog: true });
    };
    App.prototype.onBtnSave = function () {
        var selectedModel = this.state.selectedModel;
        if (selectedModel) {
            var editedModel = __assign({}, selectedModel);
            try {
                Object.setPrototypeOf(editedModel, selectedModel);
                editedModel = Model.omitChildrenProps(editedModel);
                editedModel.save();
                this.setState({ displayDialog: false });
            }
            catch (exception) {
                console.warn(exception);
                alert(exception.message);
            }
            this.updateState();
        }
    };
    App.prototype.onBtnCancel = function () {
        this.setState({ displayDialog: false, selectedModel: null });
        this.updateState();
    };
    App.prototype.remove = function (model) {
        if (model.isSaved()) {
            model.remove();
            this.updateState();
        }
    };
    App.prototype.edit = function () {
        this.setState({ displayDialog: true });
    };
    App.prototype.onCellChange = function (props, value) {
        // let updatedModels = [...props.value];
        // updatedModels[props.rowIndex][props.field] = value;
        // this.setState({unsavedRowId: props.rowData.id});
        // if (props.rowData.constructor.name === "User") {
        //   this.setState({users: updatedModels});
        // }
        // if (props.rowData.constructor.name === "Post") {
        //   this.setState({posts: updatedModels});
        // }
    };
    App.prototype.colEditor = function (props, col) {
        // return (
        //   <InputText type="text"
        //              onBlur={_=> console.log('on blur input text')}
        //     value={props.rowData[col]}
        //     onChange={(e: any) => this.onCellChange(props, e.target.value)}/>
        // )
    };
    App.prototype.dropDownUserIdCellEditor = function (props) {
        var _this = this;
        var usersIds = users.query().select('id').run();
        usersIds = usersIds.map(function (userId) {
            return { label: userId.id, value: userId.id };
        });
        return (React.createElement(Dropdown, { value: props.value[props.rowIndex].user_id, options: usersIds, onChange: function (e) { return _this.onCellChange(props, e.value); }, className: "full-width", placeholder: "User Id" }));
    };
    App.prototype.btnEdit = function () {
        var _this = this;
        return (React.createElement(Button, { onClick: function (_) { return _this.edit(); }, className: "ui-button-info", icon: "fa-edit", title: "Edit" }));
    };
    App.prototype.btnRemove = function (model) {
        var _this = this;
        return (React.createElement(Button, { onClick: function (_) { return _this.remove(model); }, className: "ui-button-danger", icon: "fa-trash", title: "Delete" }));
    };
    App.prototype.onClickTable = function (e) {
        var collection;
        var children = this.state.children;
        var tableName = e.data.tableName();
        if (tableName === "users") {
            this.setState({
                jsonContent: users.getAll({ children: children }),
                tableSelected: tableName.toUpperCase(),
            });
        }
        if (tableName === "posts") {
            this.setState({
                jsonContent: posts.getAll({ children: children }),
                tableSelected: tableName.toUpperCase(),
            });
        }
    };
    App.prototype.getSelectedTableCss = function (tableName) {
        if (this.state.tableSelected === tableName.toUpperCase()) {
            return 'centered table-selected';
        }
        else {
            return 'centered';
        }
    };
    App.prototype.onRowSelect = function (e) {
        this.setState({ selectedModel: e.data });
    };
    App.prototype.onSelectionChange = function (e) {
        this.setState({ selectedModel: e.data });
    };
    App.prototype.updateProperty = function (property, value) {
        var model = this.state.selectedModel;
        model[property] = value;
        this.setState({ selectedModel: model });
    };
    //todo: debuggear
    App.prototype.onIsAdminChange = function (value) {
        var selectedModel = this.state.selectedModel;
        selectedModel.admin = value;
        this.setState({ selectedModel: selectedModel });
    };
    App.prototype.btnLeftMenu = function () {
        this.setState({ displayLeftMenu: !this.state.displayLeftMenu });
    };
    App.prototype.onClickLeftSideMenuItem = function () {
        this.setState({ displayLeftMenu: false, displayDialogFullScreen: true });
    };
    App.prototype.render = function () {
        var _this = this;
        var _a = this.state, jsonContent = _a.jsonContent, children = _a.children, tableSelected = _a.tableSelected, users = _a.users, posts = _a.posts, selectedModel = _a.selectedModel;
        var headerUserTable = 'USERS';
        var headerPostTable = 'POSTS';
        var footerUsersTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(new User({ name: '', age: '', admin: 0 })); } })));
        var footerPostsTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(new Post({ title: '', content: '' })); } })));
        var footerDialog = React.createElement("div", { className: "ui-dialog-buttonpane ui-helper-clearfix" },
            React.createElement(Button, { icon: "fa-close", label: "Cancel", onClick: function (_) { return _this.onBtnCancel(); } }),
            React.createElement(Button, { label: "Save", icon: "fa-check", onClick: function (_) { return _this.onBtnSave(); } }));
        var isAdminOptions = [{ label: 'True', value: 1 }, { label: 'False', value: 0 }];
        return (React.createElement("div", { className: "main-content" },
            React.createElement(Toolbar, null,
                React.createElement("div", { className: "ui-toolbar-group-left" },
                    React.createElement(Button, { icon: "fa-bars", onClick: function (_) { return _this.btnLeftMenu(); }, className: "btn-menu" }),
                    React.createElement("input", { type: "checkbox", checked: children, onChange: function (_) { return _this.showChildren(); }, className: "checkbox-children" }),
                    React.createElement("span", { className: "checkbox-children-label" }, "Show Children")),
                React.createElement("div", { className: "ui-toolbar-group-right" },
                    React.createElement("strong", { className: "title" }, "\u00A0 MetaphaseJS \u00A0"))),
            React.createElement(Sidebar, { visible: this.state.displayLeftMenu, baseZIndex: 1000000, onHide: function () { return _this.setState({ displayLeftMenu: false }); } },
                React.createElement("h1", null, "MetaphaseJS"),
                React.createElement("a", { href: "javascript:void(0)", className: "left-menu-item", onClick: function (_) { return _this.onClickLeftSideMenuItem(); } },
                    React.createElement("i", { className: "fa fa-bars" }),
                    React.createElement("span", null, "Show Code")),
                React.createElement("a", { href: "javascript:void(0)", className: "left-menu-item" },
                    React.createElement("i", { className: "fa fa-bars" }),
                    React.createElement("span", null, "Item")),
                React.createElement("a", { href: "javascript:void(0)", className: "left-menu-item" },
                    React.createElement("i", { className: "fa fa-bars" }),
                    React.createElement("span", null, "Item")),
                React.createElement("a", { href: "javascript:void(0)", className: "left-menu-item" },
                    React.createElement("i", { className: "fa fa-bars" }),
                    React.createElement("span", null, "Item")),
                React.createElement(Button, { type: "button", onClick: function (_) { return _this.setState({ displayLeftMenu: true }); }, label: "Save", className: "ui-button-success" }),
                React.createElement(Button, { type: "button", onClick: function (_) { return _this.setState({ displayLeftMenu: true }); }, label: "Cancel", className: "ui-button-secondary" })),
            React.createElement(Sidebar, { fullScreen: true, visible: this.state.displayDialogFullScreen, onHide: function () { return _this.onClickLeftSideMenuItem(); } },
                React.createElement(ScrollPanel, { className: "custom code-view-container" },
                    React.createElement(CodeHighlight, { language: "javascript", tab: 2, classes: { code: 'sample-code', pre: 'pre-margin' }, style: { padding: '20px' } }, sampleCode))),
            React.createElement("p", null,
                React.createElement("button", { onClick: function (e) { return _this.loadDbFromDisk(e); } }, "load from file")),
            React.createElement("p", null,
                React.createElement("button", { onClick: function (e) { return _this.saveDbToDisk(e); } }, "Save database file")),
            React.createElement(Panel, { header: "\u2705 Tree View", toggleable: true },
                React.createElement(ScrollPanel, { className: "custom code-view-container" },
                    React.createElement(ReactJson, { ref: function (el) { return _this.reactJsonCmp = el; }, src: jsonContent, iconStyle: 'square', name: tableSelected, enableClipboard: false, displayDataTypes: false, displayObjectSize: false, theme: 'shapeshifter:inverted' }))),
            React.createElement(Panel, { header: "\u2705 Table View", toggleable: true },
                React.createElement(DataTable, { value: users, onRowClick: function (e) { return _this.onClickTable(e); }, header: headerUserTable, footer: footerUsersTable, selectionMode: "single", selection: this.state.selectedModel, onSelectionChange: function (e) { return _this.onSelectionChange(e); }, onRowSelect: function (e) { return _this.onRowSelect(e); }, className: this.getSelectedTableCss('users') },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "name", header: "Name" }),
                    React.createElement(Column, { field: "age", header: "Age" }),
                    React.createElement(Column, { field: "admin", header: "Admin" }),
                    React.createElement(Column, { header: "Edit", body: function () { return _this.btnEdit(); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } })),
                React.createElement(DataTable, { value: posts, onRowClick: function (e) { return _this.onClickTable(e); }, header: headerPostTable, footer: footerPostsTable, className: this.getSelectedTableCss('posts') },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "title", header: "Title" }),
                    React.createElement(Column, { field: "content", header: "Content" }),
                    React.createElement(Column, { field: "user_id", header: "User Id" }),
                    React.createElement(Column, { header: "Edit", body: function () { return _this.btnEdit(); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } }))),
            React.createElement(Dialog, { visible: this.state.displayDialog, header: "Edit row", modal: true, footer: footerDialog, onHide: function () { return _this.setState({ displayDialog: false }); } },
                React.createElement("div", { className: "ui-grid ui-grid-responsive ui-fluid" },
                    React.createElement("div", { className: "ui-grid-row" },
                        React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                            React.createElement("label", { htmlFor: "name" }, "Name")),
                        React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                            React.createElement(InputText, { id: "name", onChange: function (e) { _this.updateProperty('name', e.target.value); }, value: selectedModel && selectedModel.name }))),
                    React.createElement("div", { className: "ui-grid-row" },
                        React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                            React.createElement("label", { htmlFor: "age" }, "Age")),
                        React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                            React.createElement(InputText, { id: "age", onChange: function (e) { _this.updateProperty('age', e.target.value); }, value: selectedModel && selectedModel.age }))),
                    React.createElement("div", { className: "ui-grid-row" },
                        React.createElement("div", { className: "ui-grid-col-4 dialog-label" },
                            React.createElement("label", { htmlFor: "admin" }, "Admin")),
                        React.createElement("div", { className: "ui-grid-col-8 dialog-label" },
                            React.createElement(Dropdown, { value: selectedModel && selectedModel.admin, id: "admin", dataKey: "admin", options: isAdminOptions, onChange: function (e) { return _this.onIsAdminChange(e.value); }, className: "dropdown", placeholder: "Is Admin?" })))))));
    };
    return App;
}(React.Component));
export default App;
//# sourceMappingURL=App.js.map