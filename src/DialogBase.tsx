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

  componentWillReceiveProps(props: Props) {
    this.setState({selectedModel: props.selectedModel});
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