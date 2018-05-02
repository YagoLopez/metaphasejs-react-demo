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
//todo: marcar filas no salvadas
//todo: marcar tabla como activa
//todo: filtrar tablas
//todo: diagram view
//todo: responsive layout
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
import { Menubar } from 'primereact/components/menubar/Menubar';
import { Button } from "primereact/components/button/Button";
import { DataTable } from 'primereact/components/datatable/DataTable';
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
        _this.SHOW_CHILDREN = false;
        _this.menuItems = [
            {
                label: 'File',
                icon: 'fa-file-o',
                items: [{
                        label: 'New',
                        icon: 'fa-plus',
                        items: [
                            { label: 'Project' },
                            { label: 'Other' },
                        ]
                    },
                    { label: 'Open' },
                    { separator: true },
                    { label: 'Quit' }
                ]
            },
            {
                label: 'Edit',
                icon: 'fa-edit',
                items: [
                    { label: 'Undo', icon: 'fa-mail-forward' },
                    { label: 'Redo', icon: 'fa-mail-reply' }
                ]
            },
            {
                label: 'Help',
                icon: 'fa-question',
                items: [
                    { label: 'Contents' },
                    {
                        label: 'Search',
                        icon: 'fa-search',
                        items: [
                            {
                                label: 'Text',
                                items: [{ label: 'Workspace' }]
                            },
                            { label: 'File' }
                        ]
                    }
                ]
            }
        ];
        var usersCollectionList = users.getAll({ children: _this.SHOW_CHILDREN });
        var postsCollectionList = posts.getAll({ children: _this.SHOW_CHILDREN });
        _this.state = {
            children: _this.SHOW_CHILDREN,
            jsonContent: usersCollectionList,
            tableSelected: 'USERS',
            usersCollection: usersCollectionList,
            postsCollection: postsCollectionList,
            unsavedRowId: undefined
        };
        return _this;
    }
    App.prototype.updateState = function () {
        var children = this.state.children;
        this.setState({
            usersCollection: users.getAll({ children: children }),
            postsCollection: posts.getAll({ children: children })
        });
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
    App.prototype.addNew = function (model) {
        // model.save();
        // this.updateState();
        if (model.tableName() === 'users') {
            var users_1 = this.state.usersCollection;
            users_1.push(model);
            this.setState({ usersCollection: users_1 });
        }
        if (model.tableName() === 'posts') {
            var posts_1 = this.state.postsCollection;
            posts_1.push(model);
            this.setState({ postsCollection: posts_1 });
        }
    };
    App.prototype.save = function (model) {
        debugger;
        var editedModel = __assign({}, model);
        try {
            Object.setPrototypeOf(editedModel, model);
            editedModel = Model.omitChildrenProps(editedModel);
            editedModel.save();
            // this.setState({unsavedRowId: false});
        }
        catch (exception) {
            console.warn(exception);
            alert(exception.message);
        }
        this.updateState();
    };
    App.prototype.remove = function (model) {
        model.remove();
        this.updateState();
    };
    App.prototype.onCellChange = function (props, value) {
        debugger;
        var updatedModels = props.value.slice();
        updatedModels[props.rowIndex][props.field] = value;
        if (props.rowData.constructor.name === "User") {
            this.setState({ usersCollection: updatedModels, unsavedRowId: 0 });
        }
        if (props.rowData.constructor.name === "Post") {
            this.setState({ postsCollection: updatedModels, unsavedRowId: 0 });
        }
    };
    // onBlurInputText(props: any, value: any) {
    //   console.log('on blur input text');
    //   let modifiedUser = {...props.rowData};
    //   try {
    //     Object.setPrototypeOf(modifiedUser, props.rowData);
    //     modifiedUser = Model.omitChildrenProps(modifiedUser);
    //     modifiedUser.save();
    //   } catch (exception) {
    //     console.error(exception);
    //     alert('Error: browser could not support "Object.setPrototypeOf()" ES6 standard')
    //   }
    // }
    App.prototype.colEditor = function (props, col) {
        var _this = this;
        return (React.createElement(InputText, { type: "text", value: props.rowData[col], onChange: function (e) { return _this.onCellChange(props, e.target.value); } }));
    };
    App.prototype.isAdminCellEditor = function (props) {
        var _this = this;
        var options = [
            { label: 'True', value: 1 },
            { label: 'False', value: 0 },
        ];
        return (React.createElement(Dropdown, { value: props.value[props.rowIndex].admin, options: options, onChange: function (e) { return _this.onCellChange(props, e.value); }, className: "full-width", placeholder: "Is Admin?" }));
    };
    App.prototype.selectUserIdCellEditor = function (props) {
        var _this = this;
        var usersIds = users.query().select('id').run();
        usersIds = usersIds.map(function (userId) {
            return { label: userId.id, value: userId.id };
        });
        return (React.createElement(Dropdown, { value: props.value[props.rowIndex].user_id, options: usersIds, onChange: function (e) { return _this.onCellChange(props, e.value); }, className: "full-width", placeholder: "User Id" }));
    };
    //todo: revisar
    //   requiredValidator(props: any) {
    // // debugger
    //     const value = props.rowData[props.field];
    //     return value && value.length > 0;
    //   }
    App.prototype.requiredValidator2 = function (obj) {
    };
    App.prototype.btnSave = function (model) {
        var _this = this;
        return (React.createElement(Button, { onClick: function (_) { return _this.save(model); }, className: "ui-button-info", icon: "fa-check-circle", title: "Save" }));
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
    App.prototype.getTableCSS = function (tableName) {
        if (this.state.tableSelected === tableName.toUpperCase()) {
            return 'centered table-selected';
        }
        else {
            return 'centered';
        }
    };
    App.prototype.rowClassName = function (rowData) {
        // let brand = rowData.brand;
        debugger;
        return { 'ui-state-highlight': rowData.id == 1 };
    };
    App.prototype.render = function () {
        var _this = this;
        var _a = this.state, jsonContent = _a.jsonContent, children = _a.children, tableSelected = _a.tableSelected, usersCollection = _a.usersCollection, postsCollection = _a.postsCollection;
        var headerUserTable = "USERS";
        var headerPostTable = "POSTS";
        var footerUsersTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.addNew(new User({ name: '', age: 0, admin: 0 })); } })));
        var footerPostsTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.addNew(new Post({ title: '', content: '' })); } })));
        return (React.createElement("div", { className: "container" },
            React.createElement(Menubar, { model: this.menuItems },
                React.createElement("input", { type: "checkbox", checked: children, onChange: function (_) { return _this.showChildren(); }, className: "checkbox-children" }),
                React.createElement("span", { className: "checkbox-children-label" }, "Show Children"),
                React.createElement("strong", { className: "title" }, "\u00A0 MetaphaseJS \u00A0")),
            React.createElement("p", null,
                React.createElement("button", { onClick: function (e) { return _this.loadDbFromDisk(e); } }, "load from file")),
            React.createElement("p", null,
                React.createElement("button", { onClick: function (e) { return _this.saveDbToDisk(e); } }, "Save database file")),
            React.createElement(Panel, { header: "\u2705 Code View", toggleable: true, collapsed: true },
                React.createElement(ScrollPanel, { className: "custom code-view-container" },
                    React.createElement(CodeHighlight, { language: "javascript", tab: 2, classes: { code: 'sample-code', pre: 'pre-margin' }, style: { padding: '20px' } }, sampleCode))),
            React.createElement(Panel, { header: "\u2705 Tree View", toggleable: true },
                React.createElement(ScrollPanel, { className: "custom code-view-container" },
                    React.createElement(ReactJson, { ref: function (el) { return _this.reactJsonCmp = el; }, src: jsonContent, iconStyle: 'square', name: tableSelected, enableClipboard: false, displayDataTypes: false, displayObjectSize: false, theme: 'shapeshifter:inverted' }))),
            React.createElement(Panel, { header: "\u2705 Table View", toggleable: true },
                React.createElement(DataTable, { value: usersCollection, onRowClick: function (e) { return _this.onClickTable(e); }, header: headerUserTable, footer: footerUsersTable, rowClassName: function (rowData) { return _this.rowClassName(rowData); }, className: this.getTableCSS('users') },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "name", header: "Name", editor: function (props) { return _this.colEditor(props, 'name'); } }),
                    React.createElement(Column, { field: "age", header: "Age", editor: function (props) { return _this.colEditor(props, 'age'); } }),
                    React.createElement(Column, { field: "admin", header: "Admin", editor: function (props) { return _this.isAdminCellEditor(props); } }),
                    React.createElement(Column, { header: "Save", body: function (model) { return _this.btnSave(model); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } })),
                React.createElement(DataTable, { value: postsCollection, onRowClick: function (e) { return _this.onClickTable(e); }, header: headerPostTable, footer: footerPostsTable, className: this.getTableCSS('posts') },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "title", header: "Title", editor: function (props) { return _this.colEditor(props, 'title'); } }),
                    React.createElement(Column, { field: "content", header: "Content", editor: function (props) { return _this.colEditor(props, 'content'); } }),
                    React.createElement(Column, { field: "user_id", header: "User Id", editor: function (props) { return _this.selectUserIdCellEditor(props); } }),
                    React.createElement(Column, { header: "Save", body: function (model) { return _this.btnSave(model); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } }))),
            React.createElement(Panel, { header: "\u2705 Nested View", toggleable: true })));
    };
    return App;
}(React.Component));
export default App;
//# sourceMappingURL=App.js.map