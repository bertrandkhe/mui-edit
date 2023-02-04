const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
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
          path.resolve(__dirname, 'dev'),
        ],
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  plugins: [
  ],
  resolve: {
    alias: {
      'mui-edit': path.resolve(__dirname, 'src/'),
    },
    extensions: ['.js', '.jsx', '.json', '.wasm', '.ts', '.tsx'],
  },
};

module.exports = (env, argv) => {
  config.mode = argv.mode;
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.entry = [
      './dev/index.tsx',
    ];
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
    );
    config.devServer = {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      historyApiFallback: true,
      compress: true,
      port: 9001,
    };
  }
  return config;
};
