const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const path = require('path');

const localProxy = {
    target: 'http://localhost:8081',
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: [path.join(__dirname, 'public'), __dirname],
        hot: true,
        proxy: {
            '/api': {...localProxy},
            '/node_modules/': {...localProxy},
            '/node-sage/': {...localProxy},
            '/sage/': {...localProxy},
            '/version': {...localProxy},
        },
        historyApiFallback: {
            rewrites: [
                {from: /^apps\/direct-labor/, to: '/'}
            ]
        },
        watchFiles: 'src/**/*',
    },
    devtool: 'source-map',
});
