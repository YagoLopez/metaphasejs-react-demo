import {getUrlParameter} from "./orm/yago.logger";

/**
 * Avoids to show virtual keyboard in smartphone when input element is tapped.
 * Used in Dialogs components.
 * @param {string} cssSelector: id attribute corresponding to the field name
 * @return {HTMLInputElement}
 */
export const setReadOnlyAttr = (cssSelector: string) => {
  try {
    // const cssSelector = `#${dropDownId} > div > input`;
    const inputEl = document.querySelector(cssSelector) as HTMLInputElement;
    inputEl.setAttribute('readOnly', 'true');
  } catch (error) {
    console.warn(`dorpDownId ${cssSelector} not found`);
  }
};

/**
 * Remove splash screen when the loading is finished
 * @elementId {string}
 */
export const removeElementFromDom = (elementId: string) => {
  const loader = document.getElementById(elementId) as HTMLDivElement;
  const body = document.querySelector('body') as HTMLBodyElement;
  body.style.background = 'white';
  body.removeChild(loader);
};

export const getDbFileName = (): string => {
  return getUrlParameter('dbfile');
};

export const isLoadDbFromFile = (): boolean => {
  return getDbFileName().length > 0;
};

export const isLoggerEnabled = (): boolean => {
  return getUrlParameter('logger').toLowerCase() === 'true';
};
