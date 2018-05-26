import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from "./App";
import {ErrorBoundary} from "./ErrorBoundary";
import {loadDbFromFile} from "./orm/database";
import {getUrlParameter} from "./orm/yago.logger";
import * as utils from './utils';


//todo: abrir issue en repo sql.js sobre thread safe
//todo: intentar homogeneizar "query" y "query()" ambas como una funcion
//todo: intentar obtener los resultados de queries como instancias de clases, no como pojos

const appElement = document.getElementById('root') as HTMLElement;

window.onbeforeunload = () => {
  utils.removeElementFromDom('root');
};

function renderApp() {
  ReactDOM.render(<ErrorBoundary><App/></ErrorBoundary>, appElement);
};

if (utils.isLoadDbFromFile()) {
  loadDbFromFile(utils.getDbFileName(), renderApp);
} else {
  renderApp();
}