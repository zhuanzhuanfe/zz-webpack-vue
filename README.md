# zz-webpack-vue ![version](https://img.shields.io/badge/version-1.0.8-blue.svg?style=flat-square)
> vue版`webpack`打包工具，主要提供公共`webpack`配置，快速接入最新最优`webpack`配置

## 前言

* 目录结构及webpack配置修改遵循vue-cli生成模版的用法
* 兼容 ejs 模版语法
* 兼容单页面及多页面应用，简单的目录结构如下：
````file
// 多页面应用
my-project
  |__ src
  |    |__ pages // 存放页面入口，用于多页面应用中
  |    |     |__ detail // 例如，详情页
  |    |     |      |__ detail.vue // 详情页模版
  |    |     |      |__ detail.js  // 详情页入口
  |    |     |__ order  // 例如，订单页
  |    |            |__ order.vue // 订单页模版
  |    |            |__ order.js  // 订单页入口
  |    |__ main.js // 入口文件js，公共js
  |__ template  // 存放模版文件
  |    |__ common // 公共模版
  |    |__ detail.ejs  //详情页模版文件
  |    |__ order.ejs  //订单页模版文件

// 单页面应用
my-project
  |__ src
  |    |__ App.vue // 入口模版
  |    |__ main.js // 入口文件
  |__ template  // 存放模版文件
       |__ common // 公共模版
       |__ index.ejs  // 项目模版
````

## 使用步骤
### 安装
````bash
$ npm i -D zz-webpack-vue
# 或
$ yarn add zz-webpack-vue
````

### 初始化-已有项目
在当前目录中生成配置文件

````bash
$ node_modules/zz-webpack-vue/bin/start
````

#### 执行命令
````bash
# dev命令，依赖全局的 webpack及webpack-dev-server工具
$ webpack-dev-server --inline --progress --disable-host-check --public --config webpack-vue/build/dev.js

# build命令, 如果需要设置环境变量为：NODE_ENV=production，推荐使用cross-env，可以兼容mac和windows
$ cross-env NODE_ENV=production node webpack-vue/build/build.js
````

### 初始化-新项目
在当前目录中生成新项目模版
````bash
$ node_modules/zz-webpack-vue/bin/init
````

#### 执行命令

````bash
# 进入新项目
$ cd webpack-vue-demo
# 安装依赖
$ npm install
# 开发
$ npm run dev
# 打包
$ npm run build
````
## webpack动态修改

主要是执行webpack功能及动态修改webpack配置

### 开发配置文件

例如，config/index.js

```javascript
let path = require('path')
module.exports = {
   // 基础配置
    base:{
      // 入口文件配置
      entry:{
        vendor:['react', 'react-dom'],
        app: path.join(process.cwd(), 'src/app')
      },
      externals: {}, // 排除部分第三方组件不打包
      cssModule: false, // css module自动关闭，部分组件库使用此功能会加载不了样式，例如antd
      cssExtract: false, // 提取css为单独的css文件，或者跟随chunk代码自动嵌入 <head>中，默认false，跟随chunk
      alias: {} // 设置别名
    },
    // 开发模式配置
    dev:{
      https: false, // https功能，默认关闭, true/false
      host: 'localhost', // 本地启动地址
      port: 8080, // 启动端口号
      assetsPublicPath: '', // 访问虚拟路径，例如 http://localhost/Mzhuanzhuan/my-project/index.html
      proxyTable: {}, // 代理
      autoOpenBrowser: true, // 启动时自动打开浏览器，默认开启，true/false
      useEslint: true , // 开启eslint验证，配置模版时选择开启或关闭，true/false
      vconsole: false // 开启调试模式，默认关闭，true/false
    },
    // 构建模式配置
    build:{
      web: "webserver", // 存放所有的html文件
      assetsPublicPath: 'https://img.static.com.cn/', // 静态资源路径
      bundleAnalyzerReport: false, // 开启代码分析报告功能，true/false，也可使用命令 npm run build --report
      cssSourceMap: false, // 控制css的sourcemap
      jsSourceMap: true, // 控制js的sourcemap
      assetsRoot: path.resolve(process.cwd(), 'dist'), // 打包生成的文件存放目录
      inline:['app.css', 'manifest.js'], // 自定义内联静态资源
      performance: true // 性能限制，首次加载js+css不能超过400k, 单个文件大小不超过: 300k
    }
}
```

### 开放接口

| 参数  | 类型  | 备注 |
|:------------- |:---------------:| -------------:|
| baseWebpackConfig | object | 公共webpack配置，可修改 |
| devWebpackConfig | object | 开发环境webpack配置，可修改 |
| prodWebpackConfig | object | 生产环境webpack配置，可修改 |
| dev | function | 开发环境使用 |
| build | function | 生产环境使用 |

* 本项目下虽然所有的webpack都可以替换成以前各个项目自己的配置文件，但为了统一性，不建议完全替换配置文件，应该遵循本插件配置文件规则

### 引入webpack插件
路径：`build/index.js`

````javascript
// 引入 webpack 打包工具
let webpackVue = require('zz-webpack-vue')
// webpack公共配置
let config = require('../config/index.js')
module.exports = webpackVue(config).then(res => {
  // 动态修改基础配置
  // 可重写公共webpack配置文件, 例如
  res.baseWebpackConfig.entry = {
    // 自定义重写
    vendor:['vue', 'vue-router'],
    app:'./src/main'
  }
  // 也可使用 webpack-merge 进行配置合并
  return res
})
````
### dev模式
路径：`build/dev.js`

执行命令：（命令需要自行配置）
```bash
$ npm run dev
```

代码：
````javascript
// 执行 npm run dev
let webpack = require('./index')
module.exports = webpack.then(res => {
  // 自定义build配置
    let dev = {
      plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
      ]
    }
    // 与默认配置合并
    res.devWebpackConfig = merge(res.prodWebpackConfig, dev)
    // 可动态修改开发环境webpack配置，例如
    res.devWebpackConfig.devtool = false
    // 也可使用 webpack-merge 进行配置合并
    return res.dev()
})
````
### build模式
路径：`build/build.js`

执行命令：（命令需要自行配置）
```bash
# 构建项目
$ npm run build
```

代码：
```javascript
// 执行 npm run build
let merge = require('webpack-merge')
let webpack = require('./index')
module.exports = webpack.then(res => {
  // 自定义build配置
  let build = {
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  }
  // 与默认配置合并
  res.prodWebpackConfig = merge(res.prodWebpackConfig, build)
  return res.build()
})
```

