let path = require('path')
module.exports = {
    // 基础配置
    base:{
      // 入口文件配置
      entry:{
        vendor:['vue'],
        app: path.join(process.cwd(), 'src/app')
      },
      externals: {}, // 排除部分第三方组件不打包
      cssExtract: false,
      cssModule: false // css module自动关闭，部分组件库使用此功能会加载不了样式，例如antd
    },
    // 开发模式配置
    dev:{
      https: false, // https功能，默认关闭
      host: 'localhost', // 本地启动地址
      port: 8084, // 启动端口号
      assetsPublicPath: '', // 访问虚拟路径，例如 http://localhost/demo/index.html
      proxyTable: {}, // 代理
      autoOpenBrowser: true, // 启动时自动打开浏览器，默认开启，true/false
      useEslint: true , // 开启eslint验证，配置模版时选择开启或关闭，true/false
      vconsole: true // 开启调试模式，默认关闭，true/false
    },
    build:{
      web: "webserver", // 存放所有的html文件
      assetsPublicPath: 'https://img.static.com.cn/', // 静态资源路径
      bundleAnalyzerReport: false, // 开启代码分析报告功能，默认关闭，true/false，也可使用命令 npm run build --report
      cssSourceMap: false,   // 开启生成sourcemap功能，true/false
      jsSourceMap: true,
      assetsRoot: path.resolve(process.cwd(), 'dist'), // 打包生成的文件存放目录
      inline:['app.css', 'manifest.js'], // 自定义内联静态资源
      performance: true // 性能限制，默认首次加载js+css不能超过400k, 单个文件大小不超过: 300k，也能是对象 {maxEntrypointSize: 400000, maxAssetSize: 300000}
    }
}