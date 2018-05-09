import * as React from 'react';
import {Model} from "./orm/model";

interface Props {
  readonly selectedModel: Model | undefined,
  readonly updateState: Function,
}

interface State {
  selectedModel: any,
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
    const dialogBelongsToSelectedModel = (dialogName: string, selectedModelClassName: string): boolean => {
      return dialogName.indexOf(selectedModelClassName) > 0;
    }
// debugger
    const dialogName = this.constructor.name;
    const {selectedModel} = props;
    const selectedModelClassName = selectedModel && selectedModel.constructor.name;
    if (selectedModelClassName && dialogBelongsToSelectedModel(dialogName, selectedModelClassName)) {
      // this.setState({selectedModel: {...props.selectedModel}});
      this.setState({selectedModel: props.selectedModel});
    }
  }

  // updateProperty(property: any, value: any) {
  //   let model = this.state.selectedModel;
  //   model[property] = value;
  //   this.setState({selectedModel: model});
  // }

  updateProperty(property: any, value: any) {
debugger
    let model = {...this.state.selectedModel};
    model[property] = value;
    this.setState({selectedModel: model});
  }

  onBtnCancel() {
    this.setState({selectedModel: undefined, displayDialog: false});
  }

//   onBtnSave() {
// debugger
//     const {selectedModel} = this.props;
//     if (selectedModel) {
//       let editedModel = {...selectedModel};
//       try {
//         Object.setPrototypeOf(editedModel, selectedModel);
//         editedModel = Model.omitChildrenProps(editedModel);
//         editedModel.save();
//         this.setState({displayDialog: false});
//       } catch (exception) {
//         console.warn(exception);
//         alert(exception.message);
//       }
//       this.props.updateState();
//     }
//   }

  onBtnSave() {
debugger
    const initialSelectedModel = this.props.selectedModel;
    if (initialSelectedModel) {
      let modifiedSelectedModel = this.state.selectedModel;
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
    }
  }

  show() {
    this.setState({displayDialog: true});
  }

}