const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

const getPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin()
  ]
  if (process.env.NODE_ENV === 'production') {
    console.log('production mode')
    plugins.push(new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }))
    plugins.push(new UglifyJsPlugin())
  }
  return plugins
}

module.exports = {
  entry: path.resolve('./src/index.js'),
  output: {
    path: path.resolve('./dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: getPlugins(),
  devServer: {
    port: 80
  }
}
