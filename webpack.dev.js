const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('node:path');

const localProxy = {
    target: 'http://localhost:8081',
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: [{
            directory: path.join(__dirname, 'public'),
            watch: false,
        }, {directory: __dirname, watch: false}],
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
