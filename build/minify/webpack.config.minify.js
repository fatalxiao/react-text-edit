var path = require('path');
var utils = require('./../utils');
var webpack = require('webpack');
var config = require('../../config/index');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var env = config.minify.env;

function assetsPath(_path) {
    return path.posix.join(config.minify.assetsSubDirectory, _path);
};

module.exports = {
    entry: {
        ReactEditor: './src/ReactEditor.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1000,
                name: assetsPath('[name].[ext]')
            }
        }].concat(utils.styleLoaders({
            sourceMap: false,
            extract: true
        }))
    },
    devtool: false,
    output: {
        // publicPath: './',
        // path: config.minify.assetsRoot,
        filename: assetsPath('[name].min.js')
    },
    plugins: [

        new webpack.DefinePlugin({
            'process.env': env
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),

        new ExtractTextPlugin({
            filename: assetsPath('[name].min.css')
        }),

        new OptimizeCSSPlugin()

    ],
    resolve: {
        extensions: ['.js']
    }
};