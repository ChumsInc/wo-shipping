import {merge} from 'webpack-merge';
import common from './webpack.common.mjs';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';


export default merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {ecma: 8},
                    compress: {ecma: 5, warnings: false, inline: 2},
                    mangle: {safari10: true},
                    output: {ecma: 5, comments: false, ascii_only: true}
                },
                parallel: true,
                extractComments: false,
                // cache: true,
            })
        ],
    },
    output: {
        filename: "[name].[contenthash:8].js",

    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin({
            filter: (file) => !file.path.includes('dist') && !file.name.includes('.map'),
        }),
        new BundleAnalyzerPlugin(),
    ]
});
