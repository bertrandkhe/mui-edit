const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const config = {
  entry: ['./src/index.tsx'],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  resolve: {
    alias: {},
    extensions: ['.js', '.jsx', '.json', '.wasm', '.ts', '.tsx'],
  },
};

module.exports = (env, argv) => {
  config.mode = argv.mode;
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.entry = [
      './src/dev/index.tsx',
    ];
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
    );
    config.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9001,
      hot: true,
      hotOnly: true,
    };
  }
  return config;
};
