import * as React from "react";
import { render } from "react-dom"
import { App } from "./app"

const appContainerId = 'app-container';

render(<App/>, document.getElementById(appContainerId));

if (module.hot) {
    module.hot.accept('./app', () => {
        const ReloadedApp = require('./app').App;
        render(<ReloadedApp/>, document.getElementById('app-container'));
    })
}
