// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    cssnano: {
      preset: 'default'
    },
    // 'postcss-flexbugs-fixes': {},
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "autoprefixer": {}
  }
}
