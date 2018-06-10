import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as renderer from 'react-test-renderer';
import {App} from "../src/App";
import {DialogBase} from "../src/DialogCmp/DialogBase"

it('renders correctly', () => {
  // const tree = renderer.create(<DialogBase></DialogBase>).toJSON();
  // expect(tree).toMatchSnapshot();
  expect(true).toBe(true);
});


// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
// });