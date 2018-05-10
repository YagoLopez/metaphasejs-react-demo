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
//todo: sigue dando error al pulsar boton edit. (no pasa cuando solo tabla users)
//probablemente tenga que ver con inicializacion de "selectedModel"
//todo: feature filtro en el listado de tabla
//todo: diagram view (static)
//todo: al hacer onclick en tableHeader, deberia cambiar el valor de this.state.tableSelected
//todo: poner en cv desarrollo de software con metodologia de tarjetas (kanban?) y Cursos Deep Learning
//todo: validacion de propiedades de modelo al salvar
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
import { Sidebar } from "primereact/components/sidebar/Sidebar";
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Button } from "primereact/components/button/Button";
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';
import { Panel } from 'primereact/components/panel/Panel';
import { getUrlParameter } from "./orm/yago.logger";
import { DialogUser } from "./DialogUser";
import { DialogPost } from "./DialogPost";
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
        var commentsList = comments.getAll();
        _this.state = {
            children: _this.SHOW_CHILDREN,
            jsonContent: usersList,
            tableSelected: 'USERS',
            users: usersList,
            posts: postsList,
            comments: commentsList,
            selectedModel: undefined,
            displayLeftMenu: false,
            displayDialogFullScreen: false,
            logger: false
        };
        _this.updateState = _this.updateState.bind(_this);
        return _this;
    }
    // dialogComments: DialogComment;
    App.prototype.componentWillMount = function () {
        if (getUrlParameter('logger').toLowerCase() === 'true') {
            this.setState({ logger: true });
        }
        else {
            this.setState({ logger: false });
        }
    };
    App.prototype.componentDidMount = function () {
        //todo: cargar aqui la base de datos desde un fichero mediante peticion xmlhttp
        // this.carservice.getCarsSmall().then(data => this.setState({cars: data}));
    };
    App.prototype.updateState = function () {
        // debugger
        var children = this.state.children;
        var usersList = users.getAll({ children: children });
        var postsList = posts.getAll({ children: children });
        var commentsList = posts.getAll({ children: children });
        if (this.state.tableSelected === 'USERS') {
            this.setState({ jsonContent: usersList });
        }
        if (this.state.tableSelected === 'POSTS') {
            this.setState({ jsonContent: postsList });
        }
        if (this.state.tableSelected === 'COMMENTS') {
            this.setState({ jsonContent: commentsList });
        }
        this.setState({
            users: usersList,
            posts: postsList,
            comments: commentsList,
            displayDialogFullScreen: false,
        });
    };
    App.prototype.showChildren = function () {
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
        if (tableSelected === 'COMMENTS') {
            this.setState({
                children: !children,
                jsonContent: posts.getAll({ children: !children })
            });
        }
        this.setState({ displayDialogFullScreen: false });
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
        saveToDisk('metaphasejs.sqlite');
    };
    App.prototype.add = function (model, dialog) {
        this.setState({ selectedModel: model });
        dialog.show();
    };
    App.prototype.btnEdit = function (model) {
        var _this = this;
        var edit = function () {
            model.tableName() === 'users' && _this.dialogUser.show();
            model.tableName() === 'posts' && _this.dialogPost.show();
            model.tableName() === 'comments' && _this.dialogComments.show();
            _this.setState({ selectedModel: model });
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
    App.prototype.onRowClick = function (e) {
        // let collection;
        // const {children} = this.state;
        // const selectedModel = e.data
        // const tableName = selectedModel.tableName();
        // if (tableName === "users") {
        //   this.setState({
        //     jsonContent: users.getAll({children}),
        //     tableSelected: tableName.toUpperCase(),
        //   });
        // }
        // if (tableName === "posts") {
        //   this.setState({
        //     jsonContent: posts.getAll({children}),
        //     tableSelected: tableName.toUpperCase(),
        //   });
        // }
    };
    App.prototype.getSelectedTableCss = function (tableName) {
        if (this.state.tableSelected === tableName.toUpperCase()) {
            return 'centered table-selected';
        }
        else {
            return 'centered';
        }
    };
    App.prototype.btnLeftMenu = function () {
        this.setState({ displayLeftMenu: !this.state.displayLeftMenu, displayDialogFullScreen: false });
    };
    App.prototype.showCode = function () {
        this.setState({ displayLeftMenu: false, displayDialogFullScreen: true });
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
    App.prototype.getUrlApp = function () {
        return this.state.logger ? "/?logger=true" : "/";
    };
    App.prototype.render = function () {
        var _this = this;
        var _a = this.state, jsonContent = _a.jsonContent, children = _a.children, tableSelected = _a.tableSelected, users = _a.users, posts = _a.posts, selectedModel = _a.selectedModel;
        var defaultUser = new User({ name: '', age: 0, admin: 0 });
        var defaultPost = new Post({ title: '', content: '' });
        var defaultComment = new Comment({ author: '', date: '' });
        var footerUsersTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultUser, _this.dialogUser); } })));
        var footerPostsTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultPost, _this.dialogPost); } })));
        var footerCommentsTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultComment, _this.dialogPost); } })));
        var dialogProps = {
            selectedModel: selectedModel,
            updateState: this.updateState,
            children: children
        };
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
                React.createElement("a", { href: "#", className: "left-menu-item", onClick: function (_) { return _this.showCode(); } },
                    React.createElement("i", { className: "fa fa-bars" }),
                    React.createElement("span", null, "Show Code")),
                React.createElement("a", { href: this.getUrlApp(), className: "left-menu-item", onClick: function (_) { return _this.switchLogger(); } },
                    React.createElement("i", { className: "fa fa-bars" }),
                    React.createElement("span", null, "Switch Logger")),
                React.createElement("a", { href: "#", className: "left-menu-item", onClick: function (_) { return _this.showCode(); } },
                    React.createElement("i", { className: "fa fa-bars" }),
                    React.createElement("span", null, "Show Code")),
                React.createElement("a", { href: "#", className: "left-menu-item", onClick: function (_) { return _this.showCode(); } },
                    React.createElement("i", { className: "fa fa-bars" }),
                    React.createElement("span", null, "Show Code"))),
            React.createElement(Sidebar, { fullScreen: true, visible: this.state.displayDialogFullScreen, onHide: function () { return _this.showCode(); } },
                React.createElement(ScrollPanel, { className: "custom code-view-container" },
                    React.createElement(CodeHighlight, { language: "javascript", tab: 2, classes: { code: 'sample-code', pre: 'pre-margin' }, style: { padding: '20px' } }, sampleCode))),
            React.createElement("p", null,
                React.createElement("button", { onClick: function (e) { return _this.loadDbFromDisk(e); } }, "load from file")),
            React.createElement("p", null,
                React.createElement("button", { onClick: function (e) { return _this.saveDbToDisk(e); } }, "Save database file")),
            React.createElement(Panel, { header: "\u2705 Tree View", toggleable: true },
                React.createElement(ScrollPanel, { className: "custom json-view-container" },
                    React.createElement(ReactJson, { ref: function (el) { return _this.reactJsonCmp = el; }, src: jsonContent, iconStyle: 'square', name: tableSelected, enableClipboard: false, displayDataTypes: false, displayObjectSize: false, theme: 'shapeshifter:inverted' }))),
            React.createElement(Panel, { header: "\u2705 Table View", toggleable: true },
                React.createElement(DataTable, { value: users, onRowClick: function (e) { return _this.onRowClick(e); }, header: "USERS", footer: footerUsersTable, className: this.getSelectedTableCss('users') },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "name", header: "Name" }),
                    React.createElement(Column, { field: "age", header: "Age" }),
                    React.createElement(Column, { field: "admin", header: "Admin" }),
                    React.createElement(Column, { header: "Edit", body: function (model) { return _this.btnEdit(model); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } })),
                React.createElement(DataTable, { value: posts, onRowClick: function (e) { return _this.onRowClick(e); }, header: "POSTS", footer: footerPostsTable, className: this.getSelectedTableCss('posts') },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "title", header: "Title" }),
                    React.createElement(Column, { field: "content", header: "Content" }),
                    React.createElement(Column, { field: "user_id", header: "User Id" }),
                    React.createElement(Column, { header: "Edit", body: function (model) { return _this.btnEdit(model); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } }))),
            React.createElement(DialogUser, __assign({ ref: function (el) { return _this.dialogUser = el; } }, dialogProps)),
            React.createElement(DialogPost, __assign({ ref: function (el) { return _this.dialogPost = el; } }, dialogProps))));
    };
    return App;
}(React.Component));
export default App;
//# sourceMappingURL=App.js.map