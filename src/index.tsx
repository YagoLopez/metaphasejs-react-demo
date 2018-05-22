import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from "./App";
import {ErrorBoundary} from "./ErrorBoundary";
import {db, loadDbFromFile} from "./orm/database";
// import {Collection} from "./orm/collection";
// import {User} from "./models/user";
// import {Post} from "./models/post";
// import {Comment} from "./models/comment";
import {getUrlParameter} from "./orm/yago.logger";
// import {LOG_FORMAT} from "./orm/yago.logger";


//todo: abrir issue en repo sql.js sobre thread safe
//todo: intentar homogeneizar "query" y "query()" como una funcion ambas
//todo: intentar obtener los resultados como clases, no como pojos

const appElement = document.getElementById('root') as HTMLElement;

function getDbFileName(): string {
  return getUrlParameter('dbfile');
};

function isLoadDbFromFile(): boolean {
  return getDbFileName().length > 0;
};

function renderApp() {
  ReactDOM.render(<ErrorBoundary><App/></ErrorBoundary>, appElement);
};

if (isLoadDbFromFile()) {
  loadDbFromFile(getDbFileName(), renderApp);
} else {
  renderApp();
}