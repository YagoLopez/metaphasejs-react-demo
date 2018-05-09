import * as React from 'react';
import {Dialog} from "primereact/components/dialog/Dialog";
import {DialogBase} from "./DialogBase";
import {InputText} from "primereact/components/inputtext/InputText";
import {Dropdown} from "primereact/components/dropdown/Dropdown";
import {Button} from "primereact/components/button/Button";
import {Model} from "./orm/model";
import {User} from "./models/user";


export class DialogUser extends DialogBase {

  onIsAdminChange(value: any) {
    const selectedModel = {...this.state.selectedModel};
    selectedModel.admin = value;
    this.setState({selectedModel: selectedModel});
  }

  render() {
    const {selectedModel, displayDialog} = this.state;
    const isAdminOptions = [{label: 'True', value: 1}, {label: 'False', value: 0}];
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
              <label htmlFor="name">Name</label>
            </div>
            <div className="ui-grid-col-8 dialog-label">
              <InputText id="name"
                         onChange={(e: any) => {this.updateProperty('name', e.target.value)}}
                         value={selectedModel ? selectedModel.name : ''}/>
            </div>
          </div>
          <div className="ui-grid-row">
            <div className="ui-grid-col-4 dialog-label">
              <label htmlFor="age">Age</label>
            </div>
            <div className="ui-grid-col-8 dialog-label">
              <InputText id="age" keyfilter="pint"
                         onChange={(e: any) => {this.updateProperty('age', e.target.value)}}
                         value={selectedModel ? selectedModel.age : ''}/>
            </div>
          </div>
          <div className="ui-grid-row">
            <div className="ui-grid-col-4 dialog-label">
              <label htmlFor="admin">Admin</label>
            </div>
            <div className="dialog-label">
              <Dropdown value={selectedModel ? selectedModel.admin : ''}
                        id="admin" dataKey="admin" options={isAdminOptions}
                        onChange={(e: {originalEvent: Event, value: any}) => this.onIsAdminChange(e.value)}
                        className="dropdown" placeholder="Is Admin?"/>
            </div>
          </div>
        </div>
      </Dialog>
    )
  }
}