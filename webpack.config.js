const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const config = {
  entry: './src/main.js',
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
          path.resolve(__dirname, "src")
        ],
      }
    ],
  },
  plugins: [
    new ESLintPlugin(),
  ],
};

module.exports = (env, argv) => {
  config.mode = argv.mode;
  if (argv.mode === 'development') {
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
    );
    config.devServer = {
      contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    };
  }
  return config;
};