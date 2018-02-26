let merge = require('webpack-merge')
let webpack = require('./index')
module.exports = webpack.then(res => {
  return res.dev()
})