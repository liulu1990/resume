'use strict'
const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/api': {
      //   target: 'http://127.0.0.1:2080',
      //   changeOrigin: true
      // }
    },

    // Various Dev Server settings
    host: '127.0.0.1',
    port: 8080,
    autoOpenBrowser: true,

    /**
     * Source Maps
     */
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/wxapi/wx/',

    /**
     * Source Maps
     */
    productionSourceMap: false,
    devtool: '#source-map'
  }
}
