import { getUrlParameter } from "metaphasejs";
/**
 * Avoids to show virtual keyboard in smartphone when input element is tapped.
 * Used in Dialog components.
 * @param {string} cssSelector
 * @return {HTMLInputElement}
 */
export var setReadOnlyAttr = function (cssSelector) {
    try {
        var inputEl = document.querySelector(cssSelector);
        inputEl.setAttribute('readOnly', 'true');
    }
    catch (error) {
        console.warn("DOM element selected by " + cssSelector + " not found");
    }
};
/**
 * Remove splash screen when loading is finished
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