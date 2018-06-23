import * as React from 'react';
import {Model} from "metaphasejs";

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

  static hasEmptyFields(model: Model): boolean {
    let result = false;
    Object.keys(model).forEach((key: string) => {
      if (model[key].length === 0) {
        alert(`field "${key}" is empty`);
        result = true;
        return;
      }
    });
    return result;
  }

  onBtnSave() {
    const initialSelectedModel = this.props.selectedModel;
    let modifiedSelectedModel = this.state.selectedModel;
    if (DialogBase.hasEmptyFields(modifiedSelectedModel) ) {
      return;
    }
    if (initialSelectedModel && initialSelectedModel !== modifiedSelectedModel) {
      try {
        Object.setPrototypeOf(modifiedSelectedModel, initialSelectedModel);
        modifiedSelectedModel = Model.omitChildrenProps(modifiedSelectedModel);
        modifiedSelectedModel.save();
        this.setState({displayDialog: false});
      } catch (exception) {
        console.error(exception);
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