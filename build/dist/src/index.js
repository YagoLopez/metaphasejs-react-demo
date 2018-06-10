//todo: abrir issue en repo sql.js sobre thread safe
//todo: intentar homogeneizar "query" y "query()" ambas como una funcion
//todo: intentar obtener los resultados de queries como instancias de clases, no como pojos
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import { loadDbFromFile } from "metaphasejs";
import * as utils from './utils';
import registerServiceWorker from './registerServiceWorker';
var appElement = document.getElementById('root');
window.onbeforeunload = function (_) {
    utils.removeElementFromDom('root');
};
function renderApp() {
    ReactDOM.render(React.createElement(ErrorBoundary, null,
        React.createElement(App, null)), appElement);
}
if (utils.isLoadDbFromFile()) {
    loadDbFromFile(utils.getDbFileName(), renderApp);
}
else {
    renderApp();
}
registerServiceWorker();
//# sourceMappingURL=index.js.map