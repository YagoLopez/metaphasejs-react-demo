
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
