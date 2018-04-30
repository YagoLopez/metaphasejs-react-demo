//todo: marcar filas no salvadas
//todo: marcar tabla como activa
//todo: filtrar tablas
//todo: diagram view
//todo: responsive layout
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

import {Menubar} from 'primereact/components/menubar/Menubar';
import {Button} from "primereact/components/button/Button";
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import {ScrollPanel} from 'primereact/components/scrollpanel/ScrollPanel';
import {Panel} from 'primereact/components/panel/Panel';
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

  SHOW_CHILDREN = false;

  state: {
    children: boolean,
    jsonContent: Model[],
    tableSelected: string,
    usersCollection: Model[],
    postsCollection: Model[]
  };

  constructor(props: any) {
    super(props);
    const usersCollectionList = users.getAll({children: this.SHOW_CHILDREN});
    const postsCollectionList = posts.getAll({children: this.SHOW_CHILDREN});
    this.state = {
      children: this.SHOW_CHILDREN,
      jsonContent: usersCollectionList,
      tableSelected: 'USERS',
      usersCollection: usersCollectionList,
      postsCollection: postsCollectionList
    }
  }

  reactJsonCmp: React.Component;

  updateState() {
    const {children} = this.state;
    this.setState({
      usersCollection: users.getAll({children}),
      postsCollection: posts.getAll({children})
    });
  }

  showChildren() {
// debugger
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

  addNew(model: Model) {
    // model.save();
    // this.updateState();
    if (model.tableName() === 'users') {
      let users = this.state.usersCollection;
      users.push(model);
      this.setState({usersCollection: users});
    }
    if (model.tableName() === 'posts') {
      let posts = this.state.postsCollection;
      posts.push(model);
      this.setState({postsCollection: posts});
    }
  }

  save(model: Model) {
    let editedModel = {...model};
    try {
      Object.setPrototypeOf(editedModel, model);
      editedModel = Model.omitChildrenProps(editedModel);
      editedModel.save();
    } catch (exception) {
      console.warn(exception);
      alert(exception.message);
    }
    this.updateState();
  }

  remove(model: Model) {
    model.remove();
    this.updateState();
  }

  onCellChange(props: any, value: any) {
    let updatedModels = [...props.value];
    updatedModels[props.rowIndex][props.field] = value;
    if (props.rowData.constructor.name === "User") {
      this.setState({usersCollection: updatedModels});
    }
    if (props.rowData.constructor.name === "Post") {
      this.setState({postsCollection: updatedModels});
    }
  }

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

  colEditor(props: any, col: string) {
    return (
      <InputText type="text"
        value={props.rowData[col]}
        onChange={(e: any) => this.onCellChange(props, e.target.value)}/>
    )
  }

  isAdminCellEditor(props: any) {
    const options = [
      {label: 'True', value: 1},
      {label: 'False', value: 0},
    ];
    return (
      <Dropdown value={props.value[props.rowIndex].admin} options={options}
        onChange={(e: any) => this.onCellChange(props, e.value)}
        className="full-width" placeholder="Is Admin?"/>
    )
  }

  selectUserIdCellEditor(props: any) {
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

  //todo: revisar
//   requiredValidator(props: any) {
// // debugger
//     const value = props.rowData[props.field];
//     return value && value.length > 0;
//   }

  requiredValidator2(obj: Object) {

  }

  btnSave(model: Model) {
    return (
      <Button onClick={_ => this.save(model)} className="ui-button-info" icon="fa-check-circle" title="Save"/>
    )
  }

  btnRemove(model: Model) {
    return (
      <Button onClick={_ => this.remove(model)} className="ui-button-danger" icon="fa-trash" title="Delete"/>
    )
  }

  menuItems=[
    {
      label: 'File',
      icon: 'fa-file-o',
      items: [{
        label: 'New',
        icon: 'fa-plus',
        items: [
          {label: 'Project'},
          {label: 'Other'},
        ]
      },
        {label: 'Open'},
        {separator:true},
        {label: 'Quit'}
      ]
    },
    {
      label: 'Edit',
      icon: 'fa-edit',
      items: [
        {label: 'Undo', icon: 'fa-mail-forward'},
        {label: 'Redo', icon: 'fa-mail-reply'}
      ]
    },
    {
      label: 'Help',
      icon: 'fa-question',
      items: [
        {label: 'Contents'},
        {
          label: 'Search',
          icon: 'fa-search',
          items: [
            {
              label: 'Text',
              items: [{label: 'Workspace'}]
            },
            {label: 'File'}
          ]}
      ]
    }
  ];

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

  getTableCSS(tableName: string) {
    if (this.state.tableSelected === tableName.toUpperCase()) {
      return 'centered table-selected';
    } else {
      return 'centered';
    }
  }


  render() {

    const {jsonContent, children, tableSelected, usersCollection, postsCollection} = this.state;
    const headerUserTable = "USERS";
    const headerPostTable = "POSTS";
    const footerUsersTable = (
      <div className="ui-helper-clearfix full-width">
        <Button className="float-left" icon="fa-plus" label="Add New"
          onClick={_ => this.addNew(new User({name: '', age: 0, admin: 0}))}/>
      </div>
    );
    const footerPostsTable = (
      <div className="ui-helper-clearfix full-width">
        <Button className="float-left" icon="fa-plus" label="Add New"
          onClick={_ => this.addNew(new Post({title: '', content: ''}))}/>
      </div>
    );


    return (
      <div className="container">

        <Menubar model={this.menuItems}>
          <input type="checkbox" checked={children} onChange={_ => this.showChildren()} className="checkbox-children"/>
          <span className="checkbox-children-label">Show Children</span>
          <strong className="title">&nbsp; MetaphaseJS &nbsp;</strong>
        </Menubar>

        <p><button onClick={(e: any) => this.loadDbFromDisk(e)}>load from file</button></p>

        <p><button onClick={(e: any) => this.saveDbToDisk(e)}>Save database file</button></p>

        <Panel header="✅ Code View" toggleable={true} collapsed={true}>
          <ScrollPanel className="custom code-view-container">
            <CodeHighlight
              language="javascript" tab={2}
              classes={{code: 'sample-code', pre: 'pre-margin'}}
              style={{padding: '20px'}}>
              { sampleCode }
            </CodeHighlight>
          </ScrollPanel>
        </Panel>

        <Panel header="✅ Tree View" toggleable={true}>
          <ScrollPanel className="custom code-view-container">
            <ReactJson
              ref={(el: React.Component) => this.reactJsonCmp = el}
              src={jsonContent} iconStyle={'square'} name={tableSelected}
              enableClipboard={false} displayDataTypes={false}
              displayObjectSize={false} theme={'shapeshifter:inverted'}
            />
          </ScrollPanel>
        </Panel>

        <Panel header="✅ Table View" toggleable={true}>

          <DataTable value={usersCollection} onRowClick={(e: any) => this.onClickTable(e)}
            header={headerUserTable} footer={footerUsersTable}
            className={this.getTableCSS('users')}>
              <Column field="id" header="Id"/>
              <Column field="name" header="Name"
                editor={(props: any) => this.colEditor(props, 'name')}/>
              <Column field="age" header="Age"
                editor={(props: any) => this.colEditor(props, 'age')}/>
              <Column field="admin" header="Admin"
                editor={(props: any) => this.isAdminCellEditor(props)}/>
              <Column header="Save" body={(model: Model) => this.btnSave(model)}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
          </DataTable>

          <DataTable value={postsCollection} onRowClick={(e: any) => this.onClickTable(e)}
            header={headerPostTable} footer={footerPostsTable}
            className={this.getTableCSS('posts')}>
              <Column field="id" header="Id"/>
              <Column field="title" header="Title"
                editor={(props: any) => this.colEditor(props, 'title')}/>
              <Column field="content" header="Content"
                editor={(props: any) => this.colEditor(props, 'content')}/>
              <Column field="user_id" header="User Id"
                editor={(props: any) => this.selectUserIdCellEditor(props)}/>
              <Column header="Save" body={(model: Model) => this.btnSave(model)}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
          </DataTable>

        </Panel>

        <Panel header="✅ Nested View" toggleable={true}>
          {/*<JSONViewer json={this.state.users}></JSONViewer>*/}
        </Panel>

      </div>
    );
  }
}
