//todo: quitar funcionalidad en json viewer y limpiar coidigo (usar nueva branch)
//todo: hacer smoke tests
//todo: feature filtro en el listado de tabla
//todo: diagram view (static)
//todo: poner en cv desarrollo de software con metodologia de tarjetas (kanban?) y Cursos Deep Learning
//todo: validacion de propiedades de modelo al salvar
//todo: validacion de campo "comment.date"
import * as React from 'react';
import './App.css';
import {Collection} from "./orm/collection";
import {User} from "./models/user";
import {Post} from "./models/post";
import {Comment} from "./models/comment";
import {sampleCode} from "./sample.code";
import ReactJson from 'react-json-view';
// import JSONViewer from 'react-json-viewer';
import CodeHighlight from 'code-highlight';
import "code-highlight/lib/style.css";
import "highlight.js/styles/atelier-forest-light.css";
import {saveToDisk} from "./orm/database";
import {query} from "./orm/query.builder";
import {Model} from "./orm/model";

import {Sidebar} from "primereact/components/sidebar/Sidebar";
import {Toolbar} from 'primereact/components/toolbar/Toolbar';
import {Button} from "primereact/components/button/Button";
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {Column} from 'primereact/components/column/Column';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import {ScrollPanel} from 'primereact/components/scrollpanel/ScrollPanel';
import {Panel} from 'primereact/components/panel/Panel';
import {getUrlParameter} from "./orm/yago.logger";
import {DialogBase} from "./DialogBase";
import {DialogUser} from "./DialogUser";
import {DialogPost} from "./DialogPost";
import {DialogComment} from "./DialogComment";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';




// Users -----------------------------------------------------------------
  const users = new Collection(User);
  const user1 = new User({name: "user1", age: 11, admin: 1});
  const user2 = new User({name: "user2", age: 22, admin: 1});
  const user3 = new User({name: "user3", age: 33, admin: 1});
  users.save(user1);
  users.save(user2);
  users.save(user3);

// Posts -----------------------------------------------------------------
  const posts = new Collection(Post);
  const post1 = new Post({title: 'title post 1', content: 'content post 1'});
  const post2 = new Post({title: 'title post 2', content: 'content post 2'});
  const post3 = new Post({title: 'title post 3', content: 'content post 3'});
  post1.belongsTo(user1);
  post2.belongsTo(user1);
  post3.belongsTo(user2);
  posts.save(post1);
  posts.save(post2);
  posts.save(post3);

// Comments -----------------------------------------------------------------
  const comments = new Collection(Comment);
  const comment1 = new Comment({author: 'author1', date: 'date1'});
  const comment2 = new Comment({author: 'author2', date: 'date2'});
  comment1.belongsTo(post1);
  comment2.belongsTo(post1);
  comment1.save();
  comment2.save();
// --------------------------------------------------------------------------


export default class App extends React.Component {

  SHOW_CHILDREN = true;

  state: {
    children: boolean,
    jsonContent: Model[],
    tableSelected: string,
    users: Model[],
    posts: Model[],
    comments: Model[],
    selectedModel: any,
    displayLeftMenu: boolean,
    displayDialogFullScreen: boolean,
    logger: boolean
  };

  constructor(props: any) {
    super(props);
    const usersList = users.getAll({children: this.SHOW_CHILDREN});
    const postsList = posts.getAll({children: this.SHOW_CHILDREN});
    const commentsList = comments.getAll();
    this.state = {
      children: this.SHOW_CHILDREN,
      jsonContent: usersList,
      tableSelected: 'USERS',
      users: usersList,
      posts: postsList,
      comments: commentsList,
      selectedModel: undefined,
      displayLeftMenu: false,
      displayDialogFullScreen: false,
      logger: false
    }
    this.updateState = this.updateState.bind(this);
  }

  reactJsonCmp: React.Component;

  dialogUser: DialogUser;

  dialogPost: DialogPost;

  dialogComment: DialogComment;

  componentWillMount() {
    if (getUrlParameter('logger').toLowerCase() === 'true') {
      this.setState({logger: true});
    } else {
      this.setState({logger: false});
    }
  }

  componentDidMount() {
    //todo: cargar aqui la base de datos desde un fichero mediante peticion xmlhttp
    // this.carservice.getCarsSmall().then(data => this.setState({cars: data}));
  }

  updateState() {
// debugger
    //todo: simplificar
    const {children} = this.state;
    const usersList = users.getAll({children});
    const postsList = posts.getAll({children});
    const commentsList = comments.getAll();
    if (this.state.tableSelected === 'USERS') {
      this.setState({jsonContent: usersList});
    }
    if (this.state.tableSelected === 'POSTS') {
      this.setState({jsonContent: postsList});
    }
    if (this.state.tableSelected === 'COMMENTS') {
      this.setState({jsonContent: commentsList});
    }
    this.setState({
      users: usersList,
      posts: postsList,
      comments: commentsList,
      displayDialogFullScreen: false,
    });
  }

  showChildren() {
    //todo: simplificar
    const {children, tableSelected} = this.state;
    if (tableSelected === 'USERS') {
      this.setState({
        children: !children,
        jsonContent: users.getAll({children: !children})
      });
    }
    if (tableSelected === 'POSTS') {
      this.setState({
        children: !children,
        jsonContent: posts.getAll({children: !children})
      });
    }
    if (tableSelected === 'COMMENTS') {
      this.setState({
        children: !children,
        jsonContent: comments.getAll()
      });
    }
    this.setState({displayDialogFullScreen: false});
  }

  loadDbFromDisk(e: any) {
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
  }

  saveDbToDisk(e: any) {
    saveToDisk('metaphasejs.sqlite');
  }

  add(model: Model, dialog: DialogBase) {
    this.setState({selectedModel: model});
    dialog.show();
  }

  btnEdit(model: Model) {
    const edit = () => {
      model.tableName() === 'users' && this.dialogUser.show();
      model.tableName() === 'posts' && this.dialogPost.show();
      model.tableName() === 'comments' && this.dialogComment.show();
      this.setState({selectedModel: model});
    }
    return (
      <Button onClick={_ => edit()} className="ui-button-info" icon="fa-edit" title="Edit"/>
    )
  }

  btnRemove(model: Model) {
    const remove = (model: Model) => {
      if (model.isSaved()) {
        model.remove();
        this.updateState();
      }
    }
    return (
      <Button onClick={_ => remove(model)} className="ui-button-danger" icon="fa-trash" title="Delete"/>
    )
  }

  onRowClick(e: any) {
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
  }

  getSelectedTableCss(tableName: string): string {
    if (this.state.tableSelected === tableName.toUpperCase()) {
      return 'centered table-selected';
    } else {
      return 'centered';
    }
  }

  btnLeftMenu() {
    this.setState({displayLeftMenu: !this.state.displayLeftMenu, displayDialogFullScreen: false});
  }

  showCode() {
    this.setState({displayLeftMenu: false, displayDialogFullScreen: true});
  }

  switchLogger() {
    const {logger} = this.state
    this.setState({logger: !logger});
    if(logger) {
      alert('Logger System Off.\n\nReloading...');
    } else {
      alert('Logger System On. Check browser console.\n\nReloading...');
    }
  }

  getUrlApp(): string {
    return this.state.logger ? "/?logger=true" : "/";
  }




  render() {

    const {jsonContent, children, tableSelected, users, posts, comments, selectedModel} = this.state;
    const defaultUser = new User({name: '', age: 0, admin: 0});
    const defaultPost = new Post({title: '', content: ''});
    const defaultComment = new Comment({author: '', date: ''});
    const getIsAdminValue = (model: Model): string => {
      return model.admin ? 'True' : 'False';
    };

    const footerUsersTable = (
      <div className="ui-helper-clearfix full-width">
        <Button className="float-left" icon="fa-plus" label="Add New"
          onClick={_ => this.add(defaultUser, this.dialogUser)}/>
      </div>
    );
    const footerPostsTable = (
      <div className="ui-helper-clearfix full-width">
        <Button className="float-left" icon="fa-plus" label="Add New"
          onClick={_ => this.add(defaultPost, this.dialogPost)}/>
      </div>
    );
    const footerCommentsTable = (
      <div className="ui-helper-clearfix full-width">
        <Button className="float-left" icon="fa-plus" label="Add New"
          onClick={_ => this.add(defaultComment, this.dialogComment)}/>
      </div>
    );
    const dialogProps = {
      selectedModel: selectedModel,
      updateState: this.updateState,
      children: children
    };

    return (

      <div className="main-content">

        <Toolbar>
          <div className="ui-toolbar-group-left">
            <Button icon="fa-bars" onClick={_ => this.btnLeftMenu()} className="btn-menu"/>
            <input type="checkbox" checked={children}
              onChange={_ => this.showChildren()} className="checkbox-children"/>
            <span className="checkbox-children-label">Show Children</span>
          </div>
          <div className="ui-toolbar-group-right">
            <strong className="title">&nbsp; MetaphaseJS &nbsp;</strong>
          </div>
        </Toolbar>

        <Sidebar visible={this.state.displayLeftMenu} baseZIndex={1000000}
          onHide={() => this.setState({displayLeftMenu: false})}>
            <h1>MetaphaseJS</h1>
            <a href="#" className="left-menu-item"
              onClick={_ => this.showCode()}>
                <i className="fa fa-bars"></i><span>Show Code</span>
            </a>
            <a href={this.getUrlApp()} className="left-menu-item"
               onClick={_ => this.switchLogger()}>
              <i className="fa fa-bars"></i><span>Switch Logger</span>
            </a>
            <a href="#" className="left-menu-item"
              onClick={_ => this.showCode()}>
                <i className="fa fa-bars"></i><span>Show Code</span>
            </a>
            <a href="#" className="left-menu-item"
              onClick={_ => this.showCode()}>
                <i className="fa fa-bars"></i><span>Show Code</span>
            </a>
        </Sidebar>

        <Sidebar fullScreen={true} visible={this.state.displayDialogFullScreen}
          onHide={() => this.showCode()}>
            <ScrollPanel className="custom code-view-container">
              <CodeHighlight
                language="javascript" tab={2}
                classes={{code: 'sample-code', pre: 'pre-margin'}}
                style={{padding: '20px'}}>
                  { sampleCode }
              </CodeHighlight>
            </ScrollPanel>
        </Sidebar>

        <p><button onClick={(e: any) => this.loadDbFromDisk(e)}>load from file</button></p>

        <p><button onClick={(e: any) => this.saveDbToDisk(e)}>Save database file</button></p>

        <Panel header="✅ Tree View" toggleable={true}>
          <ScrollPanel className="custom json-view-container">
            <ReactJson
              ref={(el: React.Component) => this.reactJsonCmp = el}
              src={jsonContent} iconStyle={'square'} name={tableSelected}
              enableClipboard={false} displayDataTypes={false}
              displayObjectSize={false} theme={'shapeshifter:inverted'}
            />
          </ScrollPanel>
        </Panel>

        <Panel header="✅ Table View" toggleable={true}>

          <DataTable value={users} onRowClick={(e: any) => this.onRowClick(e)}
            header="USERS" footer={footerUsersTable}
            className={this.getSelectedTableCss('users')}>
              <Column field="id" header="Id"/>
              <Column field="name" header="Name"/>
              <Column field="age" header="Age"/>
              <Column field="admin" header="Admin" body={(model: Model) => getIsAdminValue(model)}/>
              <Column header="Edit" body={(model: Model) => this.btnEdit(model)}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
          </DataTable>

          <DataTable value={posts} onRowClick={(e: any) => this.onRowClick(e)}
            header="POSTS" footer={footerPostsTable}
            className={this.getSelectedTableCss('posts')}>
              <Column field="id" header="Id"/>
              <Column field="title" header="Title"/>
              <Column field="content" header="Content"/>
              <Column field="user_id" header="User Id"/>
              <Column header="Edit" body={(model: Model) => this.btnEdit(model)}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
          </DataTable>

          <DataTable value={comments} onRowClick={(e: any) => this.onRowClick(e)}
            header="COMMENTS" footer={footerCommentsTable}
            className={this.getSelectedTableCss('comments')}>
              <Column field="id" header="Id"/>
              <Column field="author" header="Author"/>
              <Column field="date" header="Date"/>
              <Column field="post_id" header="Post Id"/>
              <Column header="Edit" body={(model: Model) => this.btnEdit(model)}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
          </DataTable>

        </Panel>

        {/*<Panel header="✅ Nested View" toggleable={true}>*/}
          {/*<JSONViewer json={this.state.users}></JSONViewer>*/}
        {/*</Panel>*/}


        <DialogUser ref={(el: DialogUser) => this.dialogUser = el} {...dialogProps}/>

        <DialogPost ref={(el: DialogPost) => this.dialogPost = el} {...dialogProps}/>

        <DialogComment ref={(el: DialogComment) => this.dialogComment = el} {...dialogProps}/>

      </div>
    );
  }
}
