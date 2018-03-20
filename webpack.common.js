const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/public/index'
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, 'dist', 'public')
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: [
          path.resolve(__dirname, 'src', 'server'),
          /node_modules/
        ],
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              "target": "es5",
            }
          }
        }
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader?sourceMap' },
            { loader: 'sass-loader?sourceMap' }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader' }
          ]
        })
      },
      {
        test: /\.(gif|png|jpe?g|svg|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: path.join('img', '[name].[ext]')
            }
          }
        ]
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[sha512:hash:base64:20].[ext]',
            outputPath: 'fonts/',    // where the fonts will go
            // publicPath: '../'       // override the default path
          }
        }]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./dist/public']),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin(path.join('[name].[chunkhash].css')),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'runtime'
    // }),
    new ManifestPlugin({
      fileName: 'client-manifest.json'
    }),
    new CopyWebpackPlugin([
      { from: './src/public/robo/robots.txt', to: 'robo/robots.txt' },
      { from: './src/public/robo/sitemap.xml', to: 'robo/sitemap.xml' }
    ])
  ]
}
