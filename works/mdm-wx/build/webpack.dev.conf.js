'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

process.env.NODE_ENV = 'development'
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    devtool: config.dev.devtool,
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [{
                from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
            }]
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: 'index.html',
        //     inject: true
        // }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.dev.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})

module.exports = devWebpackConfig