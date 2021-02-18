/*
 * @Author: zhangzhengzhe
 * @Date: 2019-07-03 13:21:06
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-08-27 10:54:57
 */
const path = require('path')
const webpack = require('webpack')
const _externals = require('externals-dependencies')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  cache: true,
  entry: {
    app: [
      // 如果polyfill放在这里，打包的时候将不会被external,必须在js里require才能有效external
      // 'babel-polyfill',
      './src/app.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
    chunkFilename: 'js/[id].chunk.js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src'),
    }
  },
  target: 'node',
  externals: [_externals()],
  context: __dirname,
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        MSF_ENV: '"docker"'
      }
    })
  ]
}
