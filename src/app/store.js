import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import { rootReducer } from "./reducers"

export const configureStore = (history, initialState = {}) => {

    const middlewares = [
        routerMiddleware(history)
    ];

    const devToolEnhancer = () => {
        return __DEV__ && typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
            window.devToolsExtension() : f => f
    };

    const enhancers = [
        applyMiddleware(...middlewares),
        devToolEnhancer()
    ];

    const store = createStore(rootReducer, initialState, compose(...enhancers));

    /*
     if (module.hot) {
     // Enable Webpack hot module replacement for reducers
     module.hot.accept('./reducers', () => {
     try {
     const nextReducer = require('./reducers').default;

     store.replaceReducer(nextReducer);
     } catch (error) {
     console.error(chalk.red(`==> 😭  Reducer hot reloading error ${error}`));
     }
     });
     }
     */

    return store;
};