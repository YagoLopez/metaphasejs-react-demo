// Debugging in the browser console can be controlled through a url query parameter in.
// For example: http://localhost:3000?logger=true

// Controls default logger behaviour.
// Pass a 'false' value to avoid logger. This is the desired behaviour for production.
const DEFAULT_LOG_STATE: string = 'false';

/**
 * Gets url query parameter form URL
 * @param {string} paramName
 * @returns {string}
 */
export const getUrlParameter = (paramName: string) => {
  paramName = paramName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + paramName + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * Update query string parameter
 * @param {string} uri
 * @param {string} key
 * @param {string} value
 * @return {string}
 */
export function updateQueryStringParameter(uri: string, key: string, value: string) {
  const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  const separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

// Variable that holds the looger state
let urlLogParam = getUrlParameter('logger');
urlLogParam = urlLogParam || DEFAULT_LOG_STATE;

/**
 * Disable console output messages (except error).
 * Used for production mode
 */
export function disableConsole(): void {
  // console = console || {};
  console.log = () => {};
  console.table = () => {};
  console.warn = () => {};
}

if (urlLogParam === 'false') {
  disableConsole();
}

/**
 * Log message formats: foreground color, background color
 * CSS syntax is used to format messages
 * @type {Object}
 */
export const LOG_FORMAT = {
  BLUE: 'background: ghostwhite; color: cornflowerblue; font-size: 12px; font-weight: bold',
  ORANGE: 'color: orange',
  BG_YELLOW: 'background-color: yellow'
};

/**
 * Logs sql query strings and query results, appling two formats:
 * Input (query): blue colors
 * Output (result): yellow colors
 * @param {string} msg
 * @param {"query" | "result" | string} format
 */
export function logQuery(msg: string, format: 'query' | 'result' | string): void {
  if (format === 'query') {
    const format = LOG_FORMAT.BLUE;
    console.log(`%c${msg}`, format);
  } else
  if (format === 'result') {
    const format = LOG_FORMAT.ORANGE;
    console.log(`%c✅ ${msg}`, format);
  } else {
    console.log(`%c${msg}`, format)
  }
}

/**
 * General Fn to apply format to a log message
 * @param {string} msg
 * @param {string} format
 */
export function log(msg: string, format: string): void {
  console.log(`%c${msg}`, format);
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
