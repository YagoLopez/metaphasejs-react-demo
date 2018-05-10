import * as React from 'react';
import {Dialog} from "primereact/components/dialog/Dialog";
import {DialogBase} from "./DialogBase";
import {InputText} from "primereact/components/inputtext/InputText";
import {Dropdown} from "primereact/components/dropdown/Dropdown";
import {Button} from "primereact/components/button/Button";
import {query} from "../orm/query.builder";

export class DialogComment extends DialogBase {

  postIds: {label: string, value: number}[];

  componentWillUpdate() {
    let modelIds: {id: number}[] = query.select('id').from('posts').run();
    this.postIds = modelIds.map((userIdObj: {id: number}) =>{
      return {label: userIdObj.id.toString(), value: userIdObj.id};
    })
  }

  onPostIdChange(value: any) {
    const selectedModel = {...this.state.selectedModel};
    selectedModel.post_id = value;
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
              <label htmlFor="author">Author</label>
            </div>
            <div className="ui-grid-col-8 dialog-label">
              <InputText id="author"
                         onChange={(e: any) => {this.updateProperty('author', e.target.value)}}
                         value={selectedModel ? selectedModel.author : ''}/>
            </div>
          </div>

          <div className="ui-grid-row">
            <div className="ui-grid-col-4 dialog-label">
              <label htmlFor="date">Date</label>
            </div>
            <div className="ui-grid-col-8 dialog-label">
              <InputText id="date"
                         onChange={(e: any) => {this.updateProperty('date', e.target.value)}}
                         value={selectedModel ? selectedModel.date : ''}/>
            </div>
          </div>

          <div className="ui-grid-row">
            <div className="ui-grid-col-4 dialog-label">
              <label htmlFor="post_id">Post Id</label>
            </div>
            <div className="dialog-label">
              <Dropdown value={selectedModel ? selectedModel.post_id : ''}
                        id="post_id" options={this.postIds}
                        onChange={(e: {originalEvent: Event, value: any}) => this.onPostIdChange(e.value)}
                        className="dropdown marginBottom" placeholder="Post Id"/>
            </div>
          </div>

        </div>
      </Dialog>
    )
  }
}