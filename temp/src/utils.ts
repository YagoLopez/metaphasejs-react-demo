import {getUrlParameter} from "./orm/yago.logger";

/**
 * Avoids to show virtual keyboard in smartphone when input element is tapped in DialogUser component
 * in Dropdown component, in componentDidMount() lifecylce event.
 * @param {string} dropDownId: id attribute corresponding to the field name
 * @return {HTMLInputElement}
 */
export const setReadOnlyAttr = (dropDownId: string) => {
  try {
    const cssSelector = `#${dropDownId} > div > input`;
    const inputEl = document.querySelector(cssSelector) as HTMLInputElement;
    inputEl.setAttribute('readOnly', 'true');
  } catch (error) {
    console.warn(`dorpDownId ${dropDownId} not found`);
  }
};

/**
 * Remove splash screen when the loading is finished
 */
export const removeSplashScreen = () => {
  const loader = document.getElementById('loader') as HTMLDivElement;
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
