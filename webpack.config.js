const webpack = require('webpack')
const path = require('path')
const OfflinePlugin = require('offline-plugin');

module.exports = {
  entry: {
    index: './index.js'
  },
  output: {
    path: path.resolve(__dirname + '/build'),
    filename: "app.js",
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new OfflinePlugin({
      externals: [
        'https://fonts.gstatic.com/s/bungee/v2/kJ_ur5UPA1FPpr5xGCMYqevvDin1pK8aKteLpeZ5c0A.woff2'
      ]
    })
  ],
  devtool: "cheap-source-map",
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file?name=[name].[ext]']

      }, {
        test: /\.js$/,
        loaders: ['babel']
      },
      {
        test: /manifest.json$/,
        loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
      }
    ]
  }
}
