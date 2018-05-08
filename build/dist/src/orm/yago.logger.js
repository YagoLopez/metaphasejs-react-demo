// Controls default logger behaviour. User 'false' for log supression in production mode
var DEFAULT_LOG_STATE = 'true';
/**
 * Gets an url query string parameter value form URL
 * @param {string} paramName
 * @returns {string}
 */
var getUrlParameter = function (paramName) {
    paramName = paramName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + paramName + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
/**
 * Debugging to the browser console can be controlled through a query string parameter in url.
 * For example: http://localhost:3000?logger=true
 */
var urlLogParam = getUrlParameter('logger');
urlLogParam = urlLogParam || DEFAULT_LOG_STATE;
/**
 * Disable console output messages (except error).
 * Used for production mode
 */
export function disableConsole() {
    console = console || {};
    console.log = function () { };
    console.table = function () { };
    console.warn = function () { };
}
if (urlLogParam === 'false') {
    disableConsole();
}
/**
 * Log message formats: foregorund color, background color
 * CSS syntax is used to format messages
 * @type {Object}
 */
export var LOG_FORMAT = {
    BLUE: 'background: ghostwhite; color: cornflowerblue; font-size: 12px; font-weight: bold',
    ORANGE: 'color: orange',
    BG_YELLOW: 'background-color: yellow'
};
/**
 * Logs sql query strings and results appling two formats:
 * Input (query): blue colors
 * Output (result): yellow colors
 * @param {string} msg
 * @param {"query" | "result" | string} format
 */
export function logQuery(msg, format) {
    if (format === 'query') {
        var format_1 = LOG_FORMAT.BLUE;
        console.log("%c" + msg, format_1);
    }
    else if (format === 'result') {
        var format_2 = LOG_FORMAT.ORANGE;
        console.log("%c\u2705 " + msg, format_2);
    }
    else {
        console.log("%c" + msg, format);
    }
}
/**
 * General fn to apply format to a log message
 * @param {string} msg
 * @param {string} format
 */
export function log(msg, format) {
    console.log("%c" + msg, format);
}
/* Using a global variable: ********************************** */
// interface window {
//   DEBUG: boolean;
// }
//
// export const setDebugLevel = (flag: boolean = true): void => {
//   (window as any).DEBUG = flag;
// };
/* Get query string parameters for modern browsers. Doesnt work with Jest. A shim is needed */
// const urlParams = new URLSearchParams(window.location.search);
// let urlLogParam = urlParams.get('log');
//# sourceMappingURL=yago.logger.js.map