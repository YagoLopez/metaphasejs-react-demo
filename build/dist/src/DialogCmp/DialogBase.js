var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import { Model } from "../orm/model";
var DialogBase = /** @class */ (function (_super) {
    __extends(DialogBase, _super);
    function DialogBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { selectedModel: props.selectedModel };
        return _this;
    }
    DialogBase.prototype.componentWillReceiveProps = function (props) {
        var dialogBelongsToSelectedModel = function (dialogName, selectedModelClassName) {
            return dialogName.indexOf(selectedModelClassName) > 0;
        };
        var dialogName = this.constructor.name;
        var selectedModel = props.selectedModel;
        var selectedModelClassName = selectedModel && selectedModel.constructor.name;
        if (selectedModelClassName && dialogBelongsToSelectedModel(dialogName, selectedModelClassName)) {
            this.setState({ selectedModel: props.selectedModel });
        }
    };
    DialogBase.prototype.updateProperty = function (property, value) {
        var selectedModel = __assign({}, this.state.selectedModel);
        selectedModel[property] = value;
        this.setState({ selectedModel: selectedModel });
    };
    DialogBase.prototype.onBtnCancel = function () {
        this.setState({ selectedModel: undefined, displayDialog: false });
    };
    DialogBase.prototype.onBtnSave = function () {
        var initialSelectedModel = this.props.selectedModel;
        var modifiedSelectedModel = this.state.selectedModel;
        if (initialSelectedModel && initialSelectedModel !== modifiedSelectedModel) {
            try {
                Object.setPrototypeOf(modifiedSelectedModel, initialSelectedModel);
                modifiedSelectedModel = Model.omitChildrenProps(modifiedSelectedModel);
                modifiedSelectedModel.save();
                this.setState({ displayDialog: false });
            }
            catch (exception) {
                console.warn(exception);
                alert(exception.message);
            }
            this.props.updateState();
        }
        else {
            alert('Invalid user: empty');
        }
    };
    DialogBase.prototype.show = function () {
        this.setState({ displayDialog: true });
    };
    return DialogBase;
}(React.Component));
export { DialogBase };
//# sourceMappingURL=DialogBase.js.map