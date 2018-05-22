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
 */
export var removeSplashScreen = function () {
    var loader = document.getElementById('loader');
    var body = document.querySelector('body');
    body.style.background = 'white';
    body.removeChild(loader);
};
//# sourceMappingURL=utils.js.map