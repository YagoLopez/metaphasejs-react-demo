import { getUrlParameter } from "./orm/yago.logger";
/**
 * Avoids to show virtual keyboard in smartphone when input element is tapped in DialogUser component
 * in Dropdown component, in componentDidMount() lifecylce event.
 * @param {string} dropDownId: id attribute corresponding to the field name
 * @return {HTMLInputElement}
 */
export var setReadOnlyAttr = function (dropDownId) {
    try {
        var cssSelector = "#" + dropDownId + " > div > input";
        var inputEl = document.querySelector(cssSelector);
        inputEl.setAttribute('readOnly', 'true');
    }
    catch (error) {
        console.warn("dorpDownId " + dropDownId + " not found");
    }
};
/**
 * Remove splash screen when the loading is finished
 * @elementId {string}
 */
export var removeElementFromDom = function (elementId) {
    var loader = document.getElementById(elementId);
    var body = document.querySelector('body');
    body.style.background = 'white';
    body.removeChild(loader);
};
export var getDbFileName = function () {
    return getUrlParameter('dbfile');
};
export var isLoadDbFromFile = function () {
    return getDbFileName().length > 0;
};
export var isLoggerEnabled = function () {
    return getUrlParameter('logger').toLowerCase() === 'true';
};
//# sourceMappingURL=utils.js.map