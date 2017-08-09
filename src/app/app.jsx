import * as React from "react"
import { Switch } from "react-router-dom"
import { renderRoutes } from "./routes"

import { ApplicationLayout } from "./ui/layout/ApplicationLayout"

require("./core/styles/reset.less")
require("./core/styles/normalize.less")

export class App extends React.Component {

    render() {
        return (
            <ApplicationLayout>
                <Switch>
                    {renderRoutes()}
                </Switch>
            </ApplicationLayout>
        )
    }

}