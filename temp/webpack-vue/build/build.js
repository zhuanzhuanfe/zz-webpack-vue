let webpack = require('./index')

module.exports = webpack.then(res => {
  return res.build()
}).catch(err => {
  console.log(err);
})