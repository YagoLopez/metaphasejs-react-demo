import * as React from 'react';
import {Dialog} from "primereact/components/dialog/Dialog";
import {DialogBase} from "./DialogBase";
import {InputText} from "primereact/components/inputtext/InputText";
import {Dropdown} from "primereact/components/dropdown/Dropdown";
import {Button} from "primereact/components/button/Button";
import {Model} from "./orm/model";
import {query} from "./orm/query.builder";

export class DialogPost extends DialogBase {

  userIds: {label: string, value: number}[];

  componentWillUpdate() {
    let modelIds: {id: number}[] = query.select('id').from('users').run();
    this.userIds = modelIds.map((userIdObj: {id: number}) =>{
      return {label: userIdObj.id.toString(), value: userIdObj.id};
    })
  }

  onUserIdChange(value: any) {
    const selectedModel = {...this.state.selectedModel};
    selectedModel.user_id = value;
    this.setState({selectedModel: selectedModel});
  }

  render() {
    const {selectedModel, displayDialog} = this.state;
    const footerDialog = (
      <div className="ui-dialog-buttonpane ui-helper-clearfix">
        <Button icon="fa-close" label="Cancel" onClick={_ => this.onBtnCancel()}/>
        <Button label="Save" icon="fa-check" onClick={_ => this.onBtnSave()}/>
     </div>
    );

    return (
      <Dialog visible={displayDialog} header="Edit Row" modal={true}
              footer={footerDialog} onHide={() => this.setState({displayDialog: false})}>
        <div className="ui-grid ui-grid-responsive ui-fluid">
          <div className="ui-grid-row">
            <div className="ui-grid-col-4 dialog-label">
              <label htmlFor="title">Title</label>
            </div>
            <div className="ui-grid-col-8 dialog-label">
              <InputText id="title"
                         onChange={(e: any) => {this.updateProperty('title', e.target.value)}}
                         value={selectedModel ? selectedModel.title : ''}/>
            </div>
          </div>
          <div className="ui-grid-row">
            <div className="ui-grid-col-4 dialog-label">
              <label htmlFor="content">Content</label>
            </div>
            <div className="ui-grid-col-8 dialog-label">
              <InputText id="content"
                         onChange={(e: any) => {this.updateProperty('content', e.target.value)}}
                         value={selectedModel ? selectedModel.content : ''}/>
            </div>
          </div>
          <div className="ui-grid-row">
            <div className="ui-grid-col-4 dialog-label">
              <label htmlFor="user_id">User Id</label>
            </div>
            <div className="dialog-label">
              <Dropdown value={selectedModel ? selectedModel.user_id : ''}
                        id="user_id" options={this.userIds}
                        onChange={(e: {originalEvent: Event, value: any}) => this.onUserIdChange(e.value)}
                        className="dropdown marginBottom" placeholder="User Id"/>
            </div>
          </div>

        </div>
      </Dialog>
    )
  }
}