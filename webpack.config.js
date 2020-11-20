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
    entry: './src/js/main.js',
    output: outputModes[process.env.NODE_ENV],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};
