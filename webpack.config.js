const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');

const config = {
  entry: ['./src/main.jsx'],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.wasm'],
    alias: {
      '@/components': path.resolve(__dirname, 'src/components'),
    },
  },
};

module.exports = (env, argv) => {
  config.mode = argv.mode;
  if (argv.mode === 'development') {
    config.entry = [
      'react-hot-loader/patch',
      ...config.entry,
    ];
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
      new webpack.HotModuleReplacementPlugin(),
    );
    config.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
      hot: true,
      hotOnly: true,
    };
  }
  return config;
};