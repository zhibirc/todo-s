/**
 * @overview Webpack configuration for the project.
 */

'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputModes = {
    development: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './development/client/build/')
    },
    production:  {
        filename: 'bundle.min.js',
        path: path.resolve(__dirname, './production/client/')
    }
};

module.exports = {
    entry: ['./development/client/src/js/main.js', './development/client/src/sass/main.scss'],
    output: outputModes[process.env.NODE_ENV],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: 'file-loader',
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './',
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './development/client/index.html',
            filename: 'index.html'
        })
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    }
};
