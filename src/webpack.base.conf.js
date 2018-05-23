'use strict'
const path = require('path')
const merge = require('webpack-merge')
const config = global._WEBPACK_CONFIG
const utils = require('./utils')
const vueLoaderConfig = require('./vue-loader.conf')
const mixin = require('assign-deep')
const resolve =  global._WEBPACK_RESOLVE
const entries = utils.getEntry([resolve('src/pages/**/*.js')]); // 获得多页面的入口js文件
const pages = utils.getEntry([resolve('template/**/*.ejs'), resolve('template/**/*.html'), resolve('template/**/*.htm')]);
if(pages['index'] && entries['index']) {
  delete config.base.entry['app'];
}
let baseWebpackConfig = {
    context:resolve(),
    entry: mixin(config.base.entry, entries),
    output: {
      path: config.build.assetsRoot,
      filename: '[name].js',
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: Object.assign({
        'vue': 'vue/dist/vue.js',
        '@models': resolve('build/models'),
        '@src': resolve('src'),
        '@components': resolve('src/components'),
        '@lib': resolve('src/lib'),
      }, config.base.alias)
    },
    module: {
      rules: [
        ...(config.dev.useEslint? [{
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [resolve('src')],
          options: {
            formatter: require('eslint-friendly-formatter'),
            emitWarning: !config.dev.showEslintErrorsInOverlay
          }
        }] : []),
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 3000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.ejs$/, 
          loader: "ejs-compiled-loader"
        }
      ]
    }
  }

  if (Object.keys(config.base.merge).length) {
    baseWebpackConfig = merge(baseWebpackConfig, config.base.merge);
  }

  module.exports = baseWebpackConfig
