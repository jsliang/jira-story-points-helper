import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
  entry: {
    background: './src/background.js',
    app: ['babel-polyfill', './src/index.js'],
  },
  output: {
    path: './build',
    filename: '[name].js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/manifest.json', to: 'manifest.json' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html.tpl',
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules|build/,
      loader: 'babel-loader',
    }],
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['src', 'node_modules'],
  },
};

module.exports = config;
