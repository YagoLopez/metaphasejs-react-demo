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
//todo: quitar funcionalidad en json viewer y limpiar coidigo (usar nueva branch)
//todo: hacer smoke tests
//todo: feature filtro en el listado de tabla
//todo: diagram view (static)
//todo: poner en cv desarrollo de software con metodologia de tarjetas (kanban?) y Cursos Deep Learning
//todo: validacion de propiedades de modelo al salvar
//todo: validacion de campo "comment.date"
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
import { DialogUser } from "./DialogCmp/DialogUser";
import { DialogPost } from "./DialogCmp/DialogPost";
import { DialogComment } from "./DialogCmp/DialogComment";
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
        var children = this.state.children;
        this.setState({
            users: users.getAll({ children: children }),
            posts: posts.getAll({ children: children }),
            comments: comments.getAll(),
            jsonContent: users.getAll({ children: children }),
            displayDialogFullScreen: false,
        });
    };
    App.prototype.showChildren = function () {
        var children = this.state.children;
        this.setState({
            children: !children,
            jsonContent: users.getAll({ children: !children }),
            displayDialogFullScreen: false
        });
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
            model.tableName() === 'comments' && _this.dialogComment.show();
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
    App.prototype.btnLeftMenu = function () {
        this.setState({ displayLeftMenu: !this.state.displayLeftMenu, displayDialogFullScreen: false });
    };
    App.prototype.showCode = function () {
        // toggle browser right scroll bar
        if (this.state.displayDialogFullScreen) {
            document.body.style.overflow = 'visible';
        }
        else {
            document.body.style.overflow = 'hidden';
        }
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
        var _a = this.state, jsonContent = _a.jsonContent, children = _a.children, users = _a.users, posts = _a.posts, comments = _a.comments, selectedModel = _a.selectedModel;
        var defaultUser = new User({ name: '', age: 0, admin: 0 });
        var defaultPost = new Post({ title: '', content: '' });
        var defaultComment = new Comment({ author: '', date: '' });
        var mapIsAdminValue = function (model) {
            return model.admin ? 'True' : 'False';
        };
        var footerUsersTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultUser, _this.dialogUser); } })));
        var footerPostsTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultPost, _this.dialogPost); } })));
        var footerCommentsTable = (React.createElement("div", { className: "ui-helper-clearfix full-width" },
            React.createElement(Button, { className: "float-left", icon: "fa-plus", label: "Add New", onClick: function (_) { return _this.add(defaultComment, _this.dialogComment); } })));
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
                    React.createElement(ReactJson, { ref: function (el) { return _this.reactJsonCmp = el; }, src: jsonContent, iconStyle: 'square', name: "USERS", enableClipboard: false, displayDataTypes: false, displayObjectSize: false, theme: 'shapeshifter:inverted' }))),
            React.createElement(Panel, { header: "\u2705 Table View", toggleable: true },
                React.createElement(DataTable, { value: users, onRowClick: function (e) { return _this.onRowClick(e); }, header: "USERS", footer: footerUsersTable, className: "centered" },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "name", header: "Name" }),
                    React.createElement(Column, { field: "age", header: "Age" }),
                    React.createElement(Column, { field: "admin", header: "Admin", body: function (model) { return mapIsAdminValue(model); } }),
                    React.createElement(Column, { header: "Edit", body: function (model) { return _this.btnEdit(model); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } })),
                React.createElement(DataTable, { value: posts, onRowClick: function (e) { return _this.onRowClick(e); }, header: "POSTS", footer: footerPostsTable, className: "centered" },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "title", header: "Title" }),
                    React.createElement(Column, { field: "content", header: "Content" }),
                    React.createElement(Column, { field: "user_id", header: "User Id" }),
                    React.createElement(Column, { header: "Edit", body: function (model) { return _this.btnEdit(model); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } })),
                React.createElement(DataTable, { value: comments, onRowClick: function (e) { return _this.onRowClick(e); }, header: "COMMENTS", footer: footerCommentsTable, className: "centered" },
                    React.createElement(Column, { field: "id", header: "Id" }),
                    React.createElement(Column, { field: "author", header: "Author" }),
                    React.createElement(Column, { field: "date", header: "Date" }),
                    React.createElement(Column, { field: "post_id", header: "Post Id" }),
                    React.createElement(Column, { header: "Edit", body: function (model) { return _this.btnEdit(model); } }),
                    React.createElement(Column, { header: "Delete", body: function (model) { return _this.btnRemove(model); } }))),
            React.createElement(DialogUser, __assign({ ref: function (el) { return _this.dialogUser = el; } }, dialogProps)),
            React.createElement(DialogPost, __assign({ ref: function (el) { return _this.dialogPost = el; } }, dialogProps)),
            React.createElement(DialogComment, __assign({ ref: function (el) { return _this.dialogComment = el; } }, dialogProps))));
    };
    return App;
}(React.Component));
export default App;
//# sourceMappingURL=App.js.map