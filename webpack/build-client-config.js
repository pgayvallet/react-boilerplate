'use strict';

const path = require('path'),
      webpack  = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      ExtractTextPlugin = require('extract-text-webpack-plugin');

const PROJECT_ROOT = path.resolve(__dirname, "..");

module.exports = (env) => {
    const isDev  = env === 'development';
    const isTest = env === 'test';
    const isProd = !isDev && !isTest;

    const getAppEntry = () => {
        const appEntry = path.resolve(PROJECT_ROOT, "src/app/entry.jsx");
        if(isDev) {
            return [
                'react-hot-loader/patch',
                'webpack-dev-server/client?http://localhost:9000',
                'webpack/hot/only-dev-server',
                appEntry
            ]
        } else {
            return [appEntry]
        }
    };

    const getPlugins = () => {

        // common plugins
        let plugins = [
            // Global variables
            new webpack.DefinePlugin({
                'process.env.NODE_ENV' : JSON.stringify(env),
                '__DEV__' : isDev,
            }),
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
            // extract styles to css file
            new ExtractTextPlugin({
                filename    : '[name].css',
                disable     : isDev,        // disabled in dev for hot reload.
                publicPath  : "/",
                allChunks   : true,         // required for code splitting, apparently
            }),

            // makes index.html
            new HtmlWebpackPlugin({
                template : path.resolve(PROJECT_ROOT, 'src/index.ejs'),
            })


        ];

        // development plugins
        if(isDev) {
            plugins.push(
                // Hot Reload (HMR)
                new webpack.HotModuleReplacementPlugin(),
                // Named Modules
                new webpack.NamedModulesPlugin()
            );
        }

        // production plugins
        if(isProd) {
            plugins.push(
                new webpack.optimize.UglifyJsPlugin({
                    sourceMap: true
                    //output: {},
                    //compress: {}
                }),
                new webpack.optimize.ModuleConcatenationPlugin()
            );
        }

        return plugins;
    };

    return {

        target : 'web',

        context : PROJECT_ROOT,

        entry : {
            app     : getAppEntry(),
            vendor  : path.resolve(PROJECT_ROOT, "src/vendor/vendor.js"),
        },

        output : {
            path                : path.resolve(PROJECT_ROOT, isProd ? 'dist' : 'build'),
            filename            : '[name].js',
            publicPath          : '/',
            sourceMapFilename   : '[file].map',
            chunkFilename       : '[name].js',
            pathinfo            : isDev

        },

        devtool : isProd ? "hidden-sourcemap" : 'eval',
        // "eval", "nosources-source-map", "cheap-eval-source-map" 'source-map' 'inline-source-map' 'hidden-sourcemap'


        resolve : {

            extensions: ['.js', '.jsx', '.ts', '.tsx'],

            modules : ["node_modules"],

            alias : {
            }
        },

        module : {
            rules : [

                // JS / JSX files
                {
                    test : /\.(js|jsx)$/,
                    //include: /src/,
                    exclude: /(node_modules)/,
                    use : [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [["es2015", { modules: false }], 'flow', 'react'],
                                cacheDirectory : true,
                                plugins: ["transform-runtime", "transform-object-rest-spread"]
                            }
                        }
                    ]
                },

                // SASS files
                {
                    test: /\.scss$/,
                    exclude: /(node_modules|bower_components)/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use : [
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders   : 2,
                                    minimize        : false,
                                    url             : true,
                                    import          : false,
                                    sourceMap       : isDev
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options : {
                                    sourceMap : isDev,
                                    plugins   : isDev ? [] : [
                                        require("autoprefixer"),
                                        require("cssnano")({
                                            safe            : true,
                                            zindex          : false,
                                            discardComments : {
                                                removeAll: true
                                            }
                                        })
                                    ]
                                }
                            },
                            {
                                loader  : "sass-loader",
                                options : {
                                    sourceMap : isDev,
                                    includePaths : [".", path.join(process.cwd(), "src/app/core/styles")]
                                }
                            }
                        ]
                    })

                },

                // Plain CSS files
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use : [
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders   : 1,
                                    minimize        : false,
                                    url             : true,
                                    import          : false,
                                    sourceMap       : isDev
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options : {
                                    sourceMap : isDev,
                                    plugins   : isDev ? [] : [
                                        require("autoprefixer"),
                                        require("cssnano")({
                                            safe            : true,
                                            zindex          : false,
                                            discardComments : {
                                                removeAll: true
                                            }
                                        })
                                    ]
                                }
                            }
                        ]
                    })
                },

                // images loader
                {
                    test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                    use: [
                        {
                            loader  : 'file-loader',
                            options : {
                                name : "[name].[ext]",
                                //publicPath : isProd ? "/" : "/webpack/",
                                outputPath : isProd ? "../images/" : "images/"
                            }
                        }
                    ]
                },

                // font loader
                {
                    test: /\.(woff|woff2|ttf|eot)(\?.*)?$/,
                    use: [
                        {
                            loader  : 'file-loader',
                            options : {
                                name : "[name].[ext]",
                                publicPath : isProd ? "" : "/webpack/",
                                useRelativePath : isProd,
                                outputPath : isProd ? "../fonts/" : "fonts/"
                            }
                        }
                    ]
                }

            ]
        },

        plugins : getPlugins(),

        node : {
            __filename : true,
            __dirname  : true,
            fs         : 'empty',
            vm         : 'empty',
            net        : 'empty',
            tls        : 'empty',
        }

    };
};