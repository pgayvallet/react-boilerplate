'use strict';

const path = require('path'),
      webpack  = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

const PROJECT_ROOT = path.resolve(__dirname, "..");

module.exports = () => {
    return {

        context : PROJECT_ROOT,

        entry : {
            app     : [
                'webpack-dev-server/client?http://localhost:9000',
                'webpack/hot/only-dev-server',
                path.resolve(PROJECT_ROOT, "src/app/entry.jsx")
            ],
            vendor  : path.resolve(PROJECT_ROOT, "src/vendor/vendor.js"),
        },

        output : {
            path                : path.resolve(PROJECT_ROOT, 'build'),
            filename            : '[name].js',
            publicPath          : '/',
            sourceMapFilename   : '[file].map',
            chunkFilename       : '[name].js'

        },

        resolve : {

            extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.ts', ".tsx"],

            modules : ["node_modules"],

            alias : {
            }
        },

        module : {
            rules : [
                {
                    test : /\.(js|jsx)$/,
                    //include: /src/,
                    exclude: /(node_modules)/,
                    use : [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['es2015', 'flow', 'react'],
                                cacheDirectory : true,
                                plugins: ["transform-runtime", "transform-object-rest-spread"]
                            }
                        }
                    ]
                }

            ]
        },

        plugins : [
            // vendor bundle
            new webpack.optimize.CommonsChunkPlugin({
                name     : "vendor",
                minChunks: function (module, count) {
                    return module.context && module.context.indexOf("node_modules") !== -1;
                }
            }),
            // ignore moment locale files
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            // provide plugin
            new webpack.ProvidePlugin({
                // globally imported libs
                'moment'        : "moment",
                "_"             : "lodash",
                "numeral"       : "numeral",
                // all jquery aliases
                '$'             : "jquery",
                'jQuery'        : "jquery",
                "window.jQuery" : "jquery",
                "window.$"      : "jquery"
            }),

            ///////////// DEV ONLY ->
            // TODO : see webpack-merge

            // manifest to avoid re-emit vendor on change
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            }),
            // HMR
            new webpack.HotModuleReplacementPlugin(),
            // makes index.html
            new HtmlWebpackPlugin({
                template : path.resolve(PROJECT_ROOT, 'src/index.ejs'),
            })


        ],

        node : {
            __filename : true,
            __dirname  : true
        }

    };
};