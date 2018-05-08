import * as React from 'react';
import {Model} from "./orm/model";

interface Props {
  readonly selectedModel: Model,
  readonly updateState: Function,
}

interface State {
  selectedModel: Model,
  displayDialog?: boolean,
  updateState?: Function,
}

export class DialogBase extends React.Component {

  state: State;

  props: Props;

  constructor(props: Props) {
    super(props)
    this.state = {selectedModel: props.selectedModel};
  }

  dialogBelongsToSelectedModel(dialogName: string, selectedModelClassName: string): boolean {
    return dialogName.indexOf(selectedModelClassName) > 0;
  }

  componentWillReceiveProps(props: Props) {
    const dialogName = this.constructor.name;
    const selectedModelClassName = props.selectedModel && props.selectedModel.constructor.name;
    if (this.dialogBelongsToSelectedModel(dialogName, selectedModelClassName)) {
      this.setState({selectedModel: props.selectedModel});
    }
  }

  updateProperty(property: any, value: any) {
    let model = this.state.selectedModel;
    model[property] = value;
    this.setState({selectedModel: model});
  }

  onIsAdminChange(value: any) {
    const selectedModel = this.state.selectedModel;
    selectedModel.admin = value;
    this.setState({selectedModel: selectedModel});
  }

  onBtnCancel() {
    this.setState({displayDialog: false, selectedModel: undefined});
  }

  onBtnSave() {
    const {selectedModel} = this.props;
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
      this.props.updateState();
    }
  }

  show() {
    this.setState({displayDialog: true});
  }

}