const webpack = require('webpack');
const path = require('path'); // 路径处理模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入HtmlWebpackPlugin插件
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 引入CleanWebpackPlugin插件
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // 全部打包成一个js
  entry: ['pixi.js','./src/app.js','./src/main.js'],

  // 多个入口文件分开打包
  // entry: {
  //   pixi: ['pixi.js'], // 引入的依赖模块
  //   app: './src/app.js', // 自定义的文件
  //   main: './src/main.js'
  // }
    
  output: {
    path: path.resolve(__dirname, 'dist'), //打包后的文件存放的地方
    filename: "bundle.min.js" //打包后输出单个JS文件
    // filename: "[name].[hash:20].js" //打包后分别输出JS文件
  },
  module: {
    rules: [
      {
		    test: /\.(png|jpg|mp3|wav|mp4)$/,
	      loader: 'url-loader',
   	    // options: {
		    // 	limit: 1024*1000,
		    // }
      },
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/     // 排除匹配node_modules模块
      },
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/image'),
        to: path.resolve(__dirname, 'dist/image'),
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, './src/video'),
        to: path.resolve(__dirname, 'dist/video'),
        ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: './index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}