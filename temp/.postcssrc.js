/* eslint-disable no-unused-vars */
module.exports = {
  plugins: {
    cssnano: {
      autoprefixer: false,
      zindex: false,
      discardComments: { 
        removeAll: true 
      }
    },
    // 'postcss-flexbugs-fixes': {},
    "postcss-import": {},
    autoprefixer: {
      browsers: ['> 1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
      flexbox: 'no-2009'
    }
  }
}
