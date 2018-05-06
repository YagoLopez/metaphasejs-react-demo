//todo: sigue dando error en el componente input: admin true/false
//todo: css select admin true/false
//todo: dialogos crud como componentes
//todo: feature filtro en el listado de tabla
//todo: diagram view (static)
//todo: al hacer onclick en tableHeader, deberia cambiar el valor de this.state.tableSelected
//todo: poner en cv desarrollo de software con metodologia de tarjetas (kanban?) y Cursos Deep Learning
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
    selectedModel: any,
    displayDialog: boolean,
    displayLeftMenu: boolean,
    displayDialogFullScreen: boolean,
    logger: boolean
  };

  constructor(props: any) {
    super(props);
    const usersList = users.getAll({children: this.SHOW_CHILDREN});
    const postsList = posts.getAll({children: this.SHOW_CHILDREN});
    this.state = {
      children: this.SHOW_CHILDREN,
      jsonContent: usersList,
      tableSelected: 'USERS',
      users: usersList,
      posts: postsList,
      selectedModel: undefined,
      displayDialog: false,
      displayLeftMenu: false,
      displayDialogFullScreen: false,
      logger: false
    }
  }

  reactJsonCmp: React.Component;

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

  //todo: revisar esto para ver lo de las propiedades fantasmas
  updateState() {
    const {children} = this.state;
    const usersList = users.getAll({children});
    const postsList = posts.getAll({children});
    if (this.state.tableSelected === 'USERS') {
      this.setState({jsonContent: usersList});
    }
    if (this.state.tableSelected === 'POSTS') {
      this.setState({jsonContent: postsList});
    }
    this.setState({users: usersList, posts: postsList});
  }

  showChildren() {
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
    saveToDisk('test3.sqlite');
  }

  add(model: Model) {
    this.setState({selectedModel: model, displayDialog: true});
  }

  onBtnSave() {
    const selectedModel = this.state.selectedModel;
    if (selectedModel) {
      let editedModel = {...selectedModel};
      try {
        Object.setPrototypeOf(editedModel, selectedModel);
        editedModel = Model.omitChildrenProps(editedModel);
        editedModel.save();
        this.setState({displayDialog: false});
      } catch (exception) {
        console.warn(exception);
        alert(exception.message);
      }
      this.updateState();
    }
  }

  onBtnCancel() {
    this.setState({displayDialog: false, selectedModel: null});
    this.updateState();
  }

  remove(model: Model) {
    if (model.isSaved()) {
      model.remove();
      this.updateState();
    }
  }

  edit() {
    this.setState({displayDialog: true});
  }

  //todo: revisar, puede ser el culpable de los errores de controled component
  onCellChange(props: any, value: any) {
    // let updatedModels = [...props.value];
    // updatedModels[props.rowIndex][props.field] = value;
    // this.setState({unsavedRowId: props.rowData.id});
    // if (props.rowData.constructor.name === "User") {
    //   this.setState({users: updatedModels});
    // }
    // if (props.rowData.constructor.name === "Post") {
    //   this.setState({posts: updatedModels});
    // }
  }

  // colEditor(props: any, col: string) {
    // return (
    //   <InputText type="text"
    //              onBlur={_=> console.log('on blur input text')}
    //     value={props.rowData[col]}
    //     onChange={(e: any) => this.onCellChange(props, e.target.value)}/>
    // )
  // }

  dropDownUserIdCellEditor(props: any) {
    let usersIds = users.query().select('id').run();
    usersIds = usersIds.map((userId: {id: number}) => {
      return {label: userId.id, value: userId.id};
    });
    return (
      <Dropdown value={props.value[props.rowIndex].user_id} options={usersIds}
        onChange={(e: any) => this.onCellChange(props, e.value)}
        className="full-width" placeholder="User Id"/>
    )
  }

  btnEdit() {
    return (
      <Button onClick={_ => this.edit()} className="ui-button-info" icon="fa-edit" title="Edit"/>
    )
  }

  btnRemove(model: Model) {
    return (
      <Button onClick={_ => this.remove(model)} className="ui-button-danger" icon="fa-trash" title="Delete"/>
    )
  }

  onClickTable(e: any) {
    let collection;
    const {children} = this.state;
    const tableName = e.data.tableName();
    if (tableName === "users") {
      this.setState({
        jsonContent: users.getAll({children}),
        tableSelected: tableName.toUpperCase(),
      });
    }
    if (tableName === "posts") {
      this.setState({
        jsonContent: posts.getAll({children}),
        tableSelected: tableName.toUpperCase(),
      });
    }
  }

  getSelectedTableCss(tableName: string) {
    if (this.state.tableSelected === tableName.toUpperCase()) {
      return 'centered table-selected';
    } else {
      return 'centered';
    }
  }

  onRowSelect (e: any) {
    this.setState({selectedModel: e.data});
  }

  onSelectionChange(e: any) {
    this.setState({selectedModel: e.data});
  }

  updateProperty(property: any, value: any) {
    let model = this.state.selectedModel;
    model[property] = value;
    this.setState({selectedModel: model});
  }

  //todo: debuggear
  onIsAdminChange(value: any) {
    const selectedModel = this.state.selectedModel;
    selectedModel.admin = value;
    this.setState({selectedModel: selectedModel});
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
      alert('Logger System Off.\nReloading...');
    } else {
      alert('Logger System On. Operations on data will be written to browser console.\nReloading...');
    }
  }

  getUrlApp(): string {
    return this.state.logger ? "/?logger=true" : "/";
  }




  render() {

    const {jsonContent, children, tableSelected, users, posts, selectedModel} = this.state;
    const headerUserTable = 'USERS';
    const headerPostTable = 'POSTS';
    const footerUsersTable = (<div className="ui-helper-clearfix full-width">
        <Button className="float-left" icon="fa-plus" label="Add New"
          onClick={_ => this.add(new User({name: '', age: '', admin: 0}))}/>
      </div>);
    const footerPostsTable = (<div className="ui-helper-clearfix full-width">
        <Button className="float-left" icon="fa-plus" label="Add New"
          onClick={_ => this.add(new Post({title: '', content: ''}))}/>
      </div>);
    const footerDialog = <div className="ui-dialog-buttonpane ui-helper-clearfix">
      <Button icon="fa-close" label="Cancel" onClick={_ => this.onBtnCancel()}/>
      <Button label="Save" icon="fa-check" onClick={_ => this.onBtnSave()}/>
    </div>;
    const isAdminOptions = [{label: 'True', value: 1}, {label: 'False', value: 0}];

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

          <DataTable value={users} onRowClick={(e: any) => this.onClickTable(e)}
            header={headerUserTable} footer={footerUsersTable}
            selectionMode="single"
            selection={this.state.selectedModel}
            onSelectionChange={(e: any) => this.onSelectionChange(e)}
            onRowSelect={(e: any) => this.onRowSelect(e)}
            className={this.getSelectedTableCss('users')}>
              <Column field="id" header="Id"/>
              <Column field="name" header="Name"/>
              <Column field="age" header="Age"/>
              <Column field="admin" header="Admin"/>
              <Column header="Edit" body={() => this.btnEdit()}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
          </DataTable>

          <DataTable value={posts} onRowClick={(e: any) => this.onClickTable(e)}
            header={headerPostTable} footer={footerPostsTable}
            className={this.getSelectedTableCss('posts')}>
              <Column field="id" header="Id"/>
              <Column field="title" header="Title"/>
              <Column field="content" header="Content"/>
              <Column field="user_id" header="User Id"/>
              <Column header="Edit" body={() => this.btnEdit()}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
          </DataTable>

        </Panel>

        {/*<Panel header="✅ Nested View" toggleable={true}>*/}
          {/*<JSONViewer json={this.state.users}></JSONViewer>*/}
        {/*</Panel>*/}

        <Dialog visible={this.state.displayDialog} header="Edit Row" modal={true}
          footer={footerDialog} onHide={() => this.setState({displayDialog: false})}>
            <div className="ui-grid ui-grid-responsive ui-fluid">
              <div className="ui-grid-row">
                <div className="ui-grid-col-4 dialog-label">
                  <label htmlFor="name">Name</label>
                </div>
                <div className="ui-grid-col-8 dialog-label">
                  <InputText id="name"
                    onChange={(e: any) => {this.updateProperty('name', e.target.value)}}
                    value={selectedModel && selectedModel.name}/>
                </div>
              </div>
              <div className="ui-grid-row">
                <div className="ui-grid-col-4 dialog-label">
                  <label htmlFor="age">Age</label>
                </div>
                <div className="ui-grid-col-8 dialog-label">
                  <InputText id="age"
                    onChange={(e: any) => {this.updateProperty('age', e.target.value)}}
                    value={selectedModel && selectedModel.age}/>
                </div>
              </div>
              <div className="ui-grid-row">
                <div className="ui-grid-col-4 dialog-label">
                  <label htmlFor="admin">Admin</label>
                </div>
                <div className="dialog-label">
                  <Dropdown value={selectedModel && selectedModel.admin}
                    id="admin" dataKey="admin" options={isAdminOptions}
                    onChange={(e: {originalEvent: Event, value: any}) => this.onIsAdminChange(e.value)}
                    className="dropdown" placeholder="Is Admin?"/>
                </div>
              </div>
            </div>
        </Dialog>

      </div>
    );
  }
}
