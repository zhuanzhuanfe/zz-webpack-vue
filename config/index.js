'use strict'
const path = require('path')
const mixin = require('assign-deep')
const resolve = global._WEBPACK_RESOLVE

module.exports = (config) => {
  let cfg = {
    base: mixin({
      entry:{
        vendor:['vue'],
        app: resolve('src/main.js')
      },
      externals: {}, // 排除部分第三方组件不打包
      cssExtract: false,
      cssModule: false, // css module自动关闭，部分组件库使用此功能会加载不了样式，例如antd
      alias: {} // 设置别名
    }, config.base || {}),
    dev: mixin({
      https: false,
      // Paths
      assetsSubDirectory: 'static',
      assetsPublicPath:  '',
      proxyTable: {},
  
      // Various Dev Server settings
      host: 'localhost', // can be overwritten by process.env.HOST
      port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
      autoOpenBrowser: false,
      errorOverlay: true,
      notifyOnErrors: true,
      poll: false,
      useEslint: true,
      showEslintErrorsInOverlay: false,
  
      /**
       * Source Maps
       */
      devtool: 'eval-source-map',
      cacheBusting: true,
      cssSourceMap: false,
      vconsole: false
    },config.dev || {}),
    build: mixin({
      web: 'webserver',
      // Paths
      assetsRoot: resolve('/dist'),
      assetsSubDirectory: 'static',
      assetsPublicPath: `https://${config.build.staticCdn || config.dev.host + ':' + config.dev.port}`,
  
      /**
       * Source Maps
       */
      // productionSourceMap: true,
      cssSourceMap: false,
      jsSourceMap: true,
      devtool: '#source-map',
      productionGzip: false,
      productionGzipExtensions: ['js', 'css'],
      bundleAnalyzerReport: false,
      // 是否内嵌css和manifest文件
      inline:['app.css', 'manifest.js'],
      performance: true // 性能限制，默认首次加载js+css不能超过400k, 单个文件大小不超过: 300k，也能是对象 {maxEntrypointSize: 400000, maxAssetSize: 300000}
    }, config.build || {})
  }

  if(process.env.npm_config_report) {
    cfg.build.bundleAnalyzerReport = true
  }

  return cfg
}
