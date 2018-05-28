
//todo: arreglar displa:block en editor-html en dialogoPost
//todo: arreglar errores compilacion
//todo: dynamic/async import para cargar el contenido del dialogo de codigo
//todo: diagram view (static)
//todo: option for saving binary dbfile to localstorage
//todo: separador de mensajes de logger
//todo: hacer smoke tests
//todo: probar en iexplorer
//todo: documentar api con typedoc
//todo: poder ejecutar consulta sql que conste de varias sentencias en varias lineas
//todo: probar a pasar el estado como props de tipo array. Ejm: store = {users: users.getAll(), posts: posts.getAll()}

import * as React from 'react';
import {users, posts, comments} from "./store";
import {saveDbToFile} from "./orm/database";
import {getUrlParameter, updateQueryStringParameter} from "./orm/yago.logger";
import {Model} from "./orm/model";
import {User} from "./models/user";
import {Post} from "./models/post";
import {Comment} from "./models/comment";
import {sampleCode} from "./sample.code";
import ReactJson from 'react-json-view';
import CodeHighlight from 'code-highlight';
import "code-highlight/lib/style.css";
import "highlight.js/styles/atelier-forest-light.css";
import './App.css';
import {Editor} from "primereact/components/editor/Editor";

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
import {DialogBase} from "./DialogCmp/DialogBase";
import {DialogUser} from "./DialogCmp/DialogUser";
import {DialogPost} from "./DialogCmp/DialogPost";
import {DialogComment} from "./DialogCmp/DialogComment";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import * as utils from "./utils";

declare const SQL: any;




export class App extends React.Component {

  SHOW_CHILDREN = true;

  state: {
    children: boolean,
    selectedModel: any,
    displayLeftMenu: boolean,
    displayDialogCode: boolean,
    logger: boolean,
    loadDbFromFile: boolean,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      children: this.SHOW_CHILDREN,
      selectedModel: undefined,
      displayLeftMenu: false,
      displayDialogCode: false,
      logger: utils.isLoggerEnabled(),
      loadDbFromFile: utils.isLoadDbFromFile(),
    };
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
    utils.removeElementFromDom('loader');
  }

  updateState() {
    this.forceUpdate();
  }

  showChildren() {
    const {children} = this.state;
    // const {users} = this.props;
    this.setState({
      children: !children,
      jsonContent: users.getAll({children: !children}),
      displayDialogCode: false
    });
  }

  saveDbToDisk(e: any) {
    saveDbToFile('metaphase.sqlite');
  }

  add(model: Model, dialog: DialogBase) {
    this.setState({selectedModel: model});
    dialog.show();
  }

  btnEdit(selectedModel: Model) {
    const edit = () => {
      selectedModel.tableName() === 'users' && this.dialogUser.show();
      selectedModel.tableName() === 'posts' && this.dialogPost.show();
      selectedModel.tableName() === 'comments' && this.dialogComment.show();
      this.setState({selectedModel: selectedModel});
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

  btnBurguer() {
    this.setState({displayLeftMenu: !this.state.displayLeftMenu});
  }

  showCode() {
    document.body.style.overflow = 'hidden';
    setTimeout(_ => {
      this.setState({displayLeftMenu: false, displayDialogCode: true});
    }, 0);
  }

  hideCode() {
    document.body.style.overflow = 'visible';
    this.setState({displayLeftMenu: false, displayDialogCode: false});
  }

  switchLogger() {
    const {logger} = this.state
    this.setState({logger: !logger});
    if (logger) {
      alert('Logger System Off.\n\nReloading...');
    } else {
      alert('Logger System On. Check browser console.\n\nReloading...');
    }
  }

  getUrlAppWithLogger(): string {
    if (this.state.logger) {
      return updateQueryStringParameter(location.href, 'logger', 'true');
    } else {
      return updateQueryStringParameter(location.href, 'logger', 'false');
    }
  }

  getUrlAppLoadDbFromDisk(): string {
    if (this.state.loadDbFromFile) {
      return updateQueryStringParameter(location.href, 'dbfile', 'metaphase.sqlite');
    } else {
      return updateQueryStringParameter(location.href, 'dbfile', '');
    }
  }

  switchDb() {
    const {loadDbFromFile} = this.state;
    this.setState({loadDbFromFile: !loadDbFromFile});
    if (loadDbFromFile) {
      alert('Load application state from database created by code...')
    } else {
      alert('Load application state from database file...');
    }
   }



  render() {

    const {children, selectedModel, displayLeftMenu, displayDialogCode} = this.state;
    const defaultUser = new User({name: '', age: '', admin: 0});
    const defaultPost = new Post({title: '', content: ''});
    const defaultComment = new Comment({author: '', date: new Date()});

    const mapIsAdminValue = (model: Model): string => {
      return model.admin ? 'True' : 'False';
    };
    const footerTableUsers = (
      <div className="ui-helper-clearfix full-width">
        <Button className="float-left" icon="fa-plus" label="Add New"
                onClick={_ => this.add(defaultUser, this.dialogUser)}/>
      </div>
    );
    const footerTablePosts = (
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
    const JsonViewPanelHeader = (
      <span>✅ Json State View<input type="checkbox" checked={children}
                               onChange={_ => this.showChildren()} className="checkbox-children"/>
      <span className="checkbox-children-label" onClick={_ => this.showChildren()}>Show Children</span></span>
    );



    return (

      <div className="main-content">

        {/*top menu bar*/}
        <Toolbar>
          <div className="ui-toolbar-group-left">
            <Button icon="fa-bars" onClick={_ => this.btnBurguer()} className="btn-menu"/>
          </div>
          <strong className="title">MetaphaseJS Demo</strong>
        </Toolbar>

        {/*left side menu*/}
        <Sidebar visible={displayLeftMenu} baseZIndex={1000000}
                 onHide={() => this.setState({displayLeftMenu: false})}>
          <h1><img src="mp-logo-leftmenu.svg" className="logo-leftside-menu"/> MetaphaseJS</h1>
          <a href="javascript:void(0)" className="left-menu-item" onClick={_ => this.showCode()}>
            <i className="fa fa-file-code-o"></i><span>Show Code</span>
          </a>
          <a href={this.getUrlAppWithLogger()} className="left-menu-item" onClick={_ => this.switchLogger()}>
            <i className="fa fa-refresh"></i><span>Switch Logger</span>
          </a>
          <a href={this.getUrlAppLoadDbFromDisk()} className="left-menu-item" onClick={_ => this.switchDb()}>
            <i className="fa fa-refresh"></i><span>Switch data origin</span>
          </a>
          <a href="javascript:void(0)" className="left-menu-item"  onClick={(e: any) => this.saveDbToDisk(e)}>
            <i className="fa fa-database"></i><span>Save state to file</span>
          </a>
        </Sidebar>

        {/*code dialog*/}
        <Sidebar fullScreen={true} visible={displayDialogCode} onHide={() => this.hideCode()}>
          <h2 className="centered title-border">✅ Code View</h2>
          <div className="centered subtitle">
            Source code for store creation, model definitions and relations
          </div>
          <ScrollPanel className="custom code-view-container">
            <CodeHighlight
              language="javascript" tab={2}
              classes={{code: 'sample-code', pre: 'pre-margin'}}>
              {sampleCode}
            </CodeHighlight>
          </ScrollPanel>
        </Sidebar>

        <div className="fade-in-long">

          {/*json state view*/}
          <Panel header={JsonViewPanelHeader} toggleable={true}>
            <ScrollPanel className="custom json-view-container">
              <ReactJson ref={(el: React.Component) => this.reactJsonCmp = el}
                src={users.getAll({children})} iconStyle={'square'} name="USERS"
                enableClipboard={false} displayDataTypes={false}
                displayObjectSize={false} theme={'shapeshifter:inverted'}/>
            </ScrollPanel>
          </Panel>

          {/*table state view*/}
          <Panel header="✅ Table State View" toggleable={true}>

            <DataTable value={users.getAll()}
                       header="USERS" footer={footerTableUsers} className="centered">
              <Column field="id" header="Id"/>
              <Column field="name" header="Name"/>
              <Column field="age" header="Age"/>
              <Column field="admin" header="Admin" body={(model: Model) => mapIsAdminValue(model)}/>
              <Column header="Edit" body={(model: Model) => this.btnEdit(model)}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
            </DataTable>

            <DataTable value={posts.getAll()}
                       header="POSTS" footer={footerTablePosts} className="centered">
              <Column field="id" header="Id"/>
              <Column field="title" header="Title"/>
              <Column field="content" header="Content" className="ellipsis"/>
              <Column field="user_id" header="User Id"/>
              <Column header="Edit" body={(model: Model) => this.btnEdit(model)}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
            </DataTable>

            <DataTable value={comments.getAll()}
                       header="COMMENTS" footer={footerCommentsTable} className="centered">
              <Column field="id" header="Id"/>
              <Column field="author" header="Author"/>
              <Column field="date" header="Date" className="ellipsis"/>
              <Column field="post_id" header="Post Id"/>
              <Column header="Edit" body={(model: Model) => this.btnEdit(model)}/>
              <Column header="Delete" body={(model: Model) => this.btnRemove(model)}/>
            </DataTable>

          </Panel>

        </div>

        <DialogUser ref={(el: DialogUser) => this.dialogUser = el} {...dialogProps}/>

        <DialogPost ref={(el: DialogPost) => this.dialogPost = el} {...dialogProps}/>

        <DialogComment ref={(el: DialogComment) => this.dialogComment = el} {...dialogProps}/>

      </div>
    );
  }
}
