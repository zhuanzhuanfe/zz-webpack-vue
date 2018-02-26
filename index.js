const path = require('path')
const merge = require('webpack-merge')
const {wrap:async} = require('co')
const npmRoot = require('npm-root')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 获取项目目录
let getLocalPath = () => {
  return new Promise((resolve, reject) => {
    npmRoot((err, npmPath) => {
      resolve(path.join(npmPath, '../'))
    })
  })
}

exports.dev = async(function* () {
  let devWebpackConfig = merge(this.baseWebpackConfig, this.devWebpackConfig)
  let utils = require('./src/utils')
  
  return new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || global._WEBPACK_CONFIG.dev.port
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        // publish the new Port, necessary for e2e tests
        process.env.PORT = port
        // add port to devServer config
        devWebpackConfig.devServer.port = port
  
        // Add FriendlyErrorsPlugin
        devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: ${global._WEBPACK_CONFIG.dev.https ? 'https' : 'http'}://${global._WEBPACK_CONFIG.dev.host}:${port}${global._WEBPACK_CONFIG.dev.assetsPublicPath}`],
          },
          onErrors: global._WEBPACK_CONFIG.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
        }))
        resolve(devWebpackConfig)
      }
    })
  })
})

exports.build = async(function* (cfg) {
  let prod = require('./src/build')
  prod(merge(this.baseWebpackConfig, this.prodWebpackConfig, cfg))
})

module.exports = async(function* (config) {
  let localPath = yield getLocalPath()
  // 设置全局目录函数
  global._WEBPACK_RESOLVE = (dir = '') => {
    return path.join(localPath, dir)
  }
  // 获取项目package
  global._WEBPACK_PKG = require(global._WEBPACK_RESOLVE('package.json'))
  // console.log(require('config/index.js'))
  global._WEBPACK_CONFIG = require('./config/index.js')(config)

  exports.baseWebpackConfig = require('./src/webpack.base.conf.js')
  exports.devWebpackConfig = require('./src/webpack.dev.conf.js')
  exports.prodWebpackConfig = require('./src/webpack.prod.conf.js')
  return exports
})
