'use strict';

const path = require("path"),
      webpack = require('webpack'),
      WebpackDevServer = require('webpack-dev-server'),
      makeConfig = require("./build-client-config");

const startWebpackServer = () => {
    const config = makeConfig('development');

    const SERVER_PORT = 9000;

    new WebpackDevServer(webpack(config), {
        publicPath          : config.output.publicPath,
        hot                 : true,
        historyApiFallback  : true,
        contentBase         : "./build/",

        proxy : {
            "/rest/*"       : "http://127.0.0.1:8080"     // proxy to backend
        },

        setup : function(app) {
            // manually configure app `app.use(...)`
        }
    }).listen(SERVER_PORT, '0.0.0.0', function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('Webpack dev server listening at localhost:' + SERVER_PORT);
    });
};

startWebpackServer();