let path = require('path')
module.exports = {
    // 基础配置
    base:{
      // 入口文件配置
      entry:{
        vendor:['vue', 'vue-router', 'vuex'],
        app:path.join(__dirname,'../', 'src/main')
      },
      cssExtract: false
    },
    // 开发模式配置
    dev:{
      https: false, // https功能，默认关闭
      host: 'localhost', // 本地启动地址
      port: 8080, // 启动端口号
      assetsPublicPath: '/demo/myproject/', // 访问虚拟路径，例如 http://localhost/Mzhuanzhuan/{{ name }}/index.html
      proxyTable: {}, // 代理
      autoOpenBrowser: true, // 启动时自动打开浏览器，默认开启，true/false
      useEslint:true, // 开启eslint验证，配置模版时选择开启或关闭，true/false
      vconsole: false // 开启调试模式，默认关闭，true/false
    },
    build:{
      staticCdn: 'img.static.com.cn', // 静态资源域名
      bundleAnalyzerReport: false, // 开启代码分析报告功能，默认关闭，true/false，也可使用命令 npm run build --report
      productionSourceMap: true,   // 开启生成sourcemap功能，true/false
      index: path.resolve(__dirname, '../dist/webserver/index.html'), // 生成的index.html文件存放目录
      assetsRoot: path.resolve(__dirname, '../dist'), // 打包生成的文件存放目录
      imagemin: true, // 开启图片压缩， true/false
      inline:['app.css', 'manifest.js'], // 自定义内联静态资源
      performance: true // 性能限制，首次加载js+css不能超过400k, 单个文件大小不超过: 300k
    }
}