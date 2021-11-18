var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
var {HotModuleReplacementPlugin} = require("webpack");
var ROOT = path.resolve(__dirname, 'src');
var webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = function (env, args) {
  return {
    entry: {
      app: [
        './src/index.ts',
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: "",
      // TODO add hash to js file
      // filename: "widget.[name].[chunkhash].min.js",
      filename: "client-view.[name].min.js",
    },
    devtool: args.mode === 'development' && 'source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [
        ROOT,
        'node_modules'
      ],
      alias: {
      },
    },
    optimization: {
      minimizer: [new UglifyJsPlugin()],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'webpack Boilerplate',
        template: path.resolve(__dirname, './src/index.html'),
        filename: 'index.html',
      }),
      new HotModuleReplacementPlugin(),
    ],
    devServer: {
      open: true,
      compress: true,
      hot: true,
      port: 8082,
      liveReload: true,
      watchFiles: [path.resolve(__dirname, './src/index.html')],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader'
          }],
        },
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'ts-loader',
            }
          ]
        },
        {
          test: /\.html$/i,
          use: [
            {
              loader: 'html-loader',
            }
          ]
        },
        {
          test: /\.less$/,
          use:

            [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  importLoaders: 1,
                  sourceMap: true,
                },
              },
              {
                loader: 'less-loader',
              },


            ],

        },
      ]
    },
   /* devServer: {

      port: 9000,
    },*/
  };
};
