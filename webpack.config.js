const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('@randomjs/mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env, argv) {
  const PRODUCTION = argv.mode === 'production';

  const ENTRY_FILES = ['./js/app.js', './css/app.scss'];
  const CSS_OUTPUT_FLIENAME = 'css/[name].css';
  const JS_OUTPUT_FILENAME = 'js/[name].js';

  const js = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader'
    }
  };
  const scss = {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: [
      {
        loader: PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader'
      }, {
        loader: '@randomjs/css-loader',
        options: {
          sourceMap: !PRODUCTION
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: !PRODUCTION
        }
      },
    ]
  };
  const file = {
    test: /\.(png|jpg|gif)$/,
    exclude: /node_modules/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }
  };

  return {
    devtool: PRODUCTION ? false : 'cheap-module-eval-source-map',
    entry: {
      app: ENTRY_FILES
    },
    output: {
      path: path.resolve('../priv/static/'),
      filename: JS_OUTPUT_FILENAME,
      publicPath: '/'
    },
    module: {
      rules: [js, scss, file],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: CSS_OUTPUT_FLIENAME,
        allowEmptyFile: true
      }),
      new CopyWebpackPlugin([path.resolve('static')]),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({ parallel: true }),
        new OptimizeCSSAssetsPlugin({}),
      ]
    },
    resolve: {
      alias: {
        img: path.resolve('images')
      }
    }
  };
};
