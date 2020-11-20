/**
 * @overview Webpack configuration for the project.
 */

'use strict';

const path = require('path');

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
    entry: './development/client/src/js/main.js',
    output: outputModes[process.env.NODE_ENV],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    }
};
