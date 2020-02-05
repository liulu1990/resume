'use strict'
const path = require('path')
const config = require('../config')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production' 
        ? config.build.assetsSubDirectory 
        : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
    options = options || {}

    // 设置 css 加载器
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        // 加载器的数组
        const loaders = [cssLoader]

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            // return ExtractTextPlugin.extract({
            //     use: loaders,
            //     fallback: 'vue-style-loader'
            // })
            return [MiniCssExtractPlugin.loader].concat(loaders)
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    const output = []
    const loaders = exports.cssLoaders(options)

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output
}