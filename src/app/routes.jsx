import * as React from "react";
import { Route } from "react-router-dom"
import { HomePage } from "./pages/home/HomePage"


let routes = [];

routes.push({
    path      : '/',
    exact     : true,
    component : HomePage
    // getComponent(nextState, cb) {}
});


export const renderRoutes = () => {
    return routes.map(route => {
        return <Route path={route.path}
                      exact={route.exact || false}
                      key={route.path}
                      component={route.component}/>
    });
};