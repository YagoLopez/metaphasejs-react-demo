
/**
 * Avoids to show virtual keyboard in smartphone when input element is tapped in Dialog component
 * User in Dropdown component, in componentDidMount() lifecylce event.
 * @param {string} dropDownId: id attribute corresponding to the field name
 * @return {HTMLInputElement}
 */
export const setReadOnlyAttr = (dropDownId: string) => {
  const inputElement = document.querySelector(`#${dropDownId} > div > input`) as HTMLInputElement;
  if (inputElement) {
    inputElement.setAttribute('readOnly', 'true');
  } else {
    console.warn(`dorpDownId ${dropDownId} not found`);
  }
};
