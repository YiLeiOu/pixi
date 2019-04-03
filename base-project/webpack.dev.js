// webpack.dev.js
const merge = require('webpack-merge');  // 引入webpack-merge功能模块
const common = require('./webpack.config.js'); // 引入webpack.config.js

module.exports = merge(common, {   // 将webpack.common.js合并到当前文件
  devServer: {
    contentBase: "./dist",   // 本地服务器所加载文件的目录
    port: "9000",  // 设置端口号
    inline: true,  // 文件修改后实时刷新
    historyApiFallback: true, //不跳转
  }
})