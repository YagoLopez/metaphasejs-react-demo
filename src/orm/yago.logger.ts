// Controls default logger behaviour. User 'false' for log supression in production mode
const DEFAULT_LOG_STATE: string = 'false';

/**
 * Gets an url query string parameter value form URL
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
 * Debugging to the browser console can be controlled through a query string parameter in url.
 * For example: http://localhost:3000?logger=true
 */
let urlLogParam = getUrlParameter('logger');
urlLogParam = urlLogParam || DEFAULT_LOG_STATE;

/**
 * Disable console output messages (except error).
 * Used for production mode
 */
export function disableConsole(): void {
  console = console || {};
  console.log = () => {};
  console.table = () => {};
  console.warn = () => {};
}

if (urlLogParam === 'false') {
  disableConsole();
}

/**
 * Log message formats: foregorund color, background color
 * CSS syntax is used to format messages
 * @type {Object}
 */
export const LOG_FORMAT = {
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
 * General fn to apply format to a log message
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
