'use strict'
const fs = require('fs');
const exists = fs.existsSync
const os = require('os')
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = global._WEBPACK_CONFIG
const resolve = global._WEBPACK_RESOLVE
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets- nwebpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const entries = utils.getEntry([resolve('src/pages/**/*.js')]); // 获得多页面的入口js文件
const pages = utils.getEntry([resolve('template/**/*.ejs'), resolve('template/**/*.html'), resolve('template/**/*.htm')]);

const env =  require('../config/prod.env')
const webpackConfig = {
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js'
    }
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: config.base.cssExtract || false,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      parallel: {
        cache: true,
        workers: os.cpus().length
      },
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告 
        warnings: false,
        // 删除所有的 `console` 语句
        // drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      },
      sourceMap: config.build.productionSourceMap
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh|en/),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: false,
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
      ? { safe: true, map: { inline: false } }
      : { safe: true }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}

const inline = config.build.inline
let regRxpArr = []
let inlineRegExp = null
if(inline) {
  for(let [k, v] of utils.entries(inline)) {
    let patharr = v.split('.')
    regRxpArr.push(`(${patharr[0]})\.(.+)?\.${patharr[patharr.length - 1]}`)
  }
  if(regRxpArr.length) {
    inlineRegExp = new RegExp(`${regRxpArr.join('|')}$`)
  }
}

const htmlConf = (page = '', pathname = 'index') => {
  const conf = {
    filename: `${config.build.web}/${pathname === 'app' ? 'index' : pathname}.html`,
    template: page || (exists(resolve('index.ejs')) ? resolve('index.ejs') : resolve('index.html')), // 模板路径'
    inlineSource: inlineRegExp || '',
    inject: true, // js插入位置
    chunksSortMode: 'dependency',
    chunks: ['manifest', 'vendor', pathname],
    hash: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  };
  return conf;
}
// 配置多页面或单页面应用模版
let mutiPage = false;
const entriesKeys = Object.keys(entries);
Object.keys(pages).every(v => {
  if(entriesKeys.indexOf(v) >= 0) {
    mutiPage = true;
    return false;
  }
  return true;
})
if(entries && entriesKeys.length && mutiPage) {
    for (let [pathname, page] of utils.entries(pages)) {
      if (exists(resolve(`src/pages/${pathname}/${pathname}.js`))) {
        webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConf(page, pathname)));
      }
    }
} else {
  webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConf(pages['index'])));
}
webpackConfig.plugins.push(new HtmlWebpackInlineSourcePlugin());

// js处理
webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: ['manifest', 'vendor'].reverse(),
  minChunks:Infinity
}));

// chunk公共样式提取
webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: Object.keys(pages).length ? Object.keys(pages) : 'app',
  async: 'vendor-async',
  children: true,
  minChunks: 2
}));

// 开启性能限制
if(config.build.performance) {
  webpackConfig.performance = {
    hints: 'error',
    maxEntrypointSize: 400000,
    maxAssetSize: 300000
  }
}

// 开启图片压缩
if (config.build.imagemin) {
  const ImageminPlugin = require('imagemin-webpack-plugin').default
  webpackConfig.plugins.push(
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
  )
}

if(exists(resolve('static'))) {
  webpackConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: resolve('static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  )
}

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: Math.floor(Math.random()*999)+8000
  }))
}

module.exports = webpackConfig
