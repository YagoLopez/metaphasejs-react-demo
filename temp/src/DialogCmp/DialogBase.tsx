import * as React from 'react';
import {Model} from "../orm/model";

interface Props {
  readonly selectedModel: Model | undefined,
  readonly updateState: Function,
}

interface State {
  selectedModel: any,
  displayDialog?: boolean,
}

export class DialogBase extends React.Component {

  state: State;

  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {selectedModel: props.selectedModel};
  }

  componentWillReceiveProps(props: Props) {
    const dialogBelongsToSelectedModel = (dialogName: string, selectedModelClassName: string): boolean => {
      return dialogName.indexOf(selectedModelClassName) > 0;
    };
    const dialogName = this.constructor.name;
    const {selectedModel} = props;
    const selectedModelClassName = selectedModel && selectedModel.constructor.name;
    if (selectedModelClassName && dialogBelongsToSelectedModel(dialogName, selectedModelClassName)) {
      this.setState({selectedModel: props.selectedModel});
    }
  }

  updateProperty(property: any, value: any) {
    let selectedModel = {...this.state.selectedModel};
    selectedModel[property] = value;
    this.setState({selectedModel: selectedModel});
  }

  onBtnCancel() {
    this.setState({selectedModel: undefined, displayDialog: false});
  }

  // onBtnSave() {
  //   debugger
  //   const initialSelectedModel = this.props.selectedModel;
  //   let modifiedSelectedModel = this.state.selectedModel;
  //   if (initialSelectedModel && initialSelectedModel !== modifiedSelectedModel) {
  //     try {
  //       Object.setPrototypeOf(modifiedSelectedModel, initialSelectedModel);
  //       modifiedSelectedModel = Model.omitChildrenProps(modifiedSelectedModel);
  //       modifiedSelectedModel.save();
  //       this.setState({displayDialog: false});
  //     } catch (exception) {
  //       console.warn(exception);
  //       alert(exception.message);
  //     }
  //     this.props.updateState();
  //   } else {
  //     alert('Invalid user: empty');
  //   }
  // }
  onBtnSave() {
    const initialSelectedModel = this.props.selectedModel;
    let modifiedSelectedModel = this.state.selectedModel;
    if (initialSelectedModel && initialSelectedModel !== modifiedSelectedModel) {
      try {
        Object.setPrototypeOf(modifiedSelectedModel, initialSelectedModel);
        modifiedSelectedModel = Model.omitChildrenProps(modifiedSelectedModel);
        modifiedSelectedModel.save();
        this.setState({displayDialog: false});
      } catch (exception) {
        console.warn(exception);
        alert(exception.message);
      }
      this.props.updateState();
    } else {
      alert('Data has not changed');
    }
  }

  show() {
    this.setState({displayDialog: true});
  }

}