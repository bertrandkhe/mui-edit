const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = {
  entry: ['./src/components/Editor.tsx'],
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
    extensions: ['.js', '.jsx', '.json', '.wasm', '.ts', '.tsx'],
    alias: {
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/blocks': path.resolve(__dirname, 'src/blocks'),
    },
  },
};

module.exports = (env, argv) => {
  config.mode = argv.mode;
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.entry = [
      'react-hot-loader/patch',
      './src/App.tsx',
    ];
    config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
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
