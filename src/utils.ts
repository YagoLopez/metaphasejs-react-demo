import {getUrlParameter} from "metaphasejs";

/**
 * Avoids to show virtual keyboard in smartphone when input element is tapped.
 * Used in Dialog components.
 * @param {string} cssSelector
 * @return {HTMLInputElement}
 */
export const setReadOnlyAttr = (cssSelector: string) => {
  try {
    const inputEl = document.querySelector(cssSelector) as HTMLInputElement;
    inputEl.setAttribute('readOnly', 'true');
  } catch (error) {
    console.warn(`DOM element selected by ${cssSelector} not found`);
  }
};

/**
 * Remove splash screen when loading is finished
 * @elementId {string}
 */
export const removeElementFromDom = (elementId: string) => {
  const loader = document.getElementById(elementId) as HTMLDivElement;
  const body = document.querySelector('body') as HTMLBodyElement;
  body.style.background = 'white';
  loader && body.removeChild(loader);
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
