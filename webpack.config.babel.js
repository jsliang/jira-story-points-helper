import CopyWebpackPlugin from 'copy-webpack-plugin';

const config = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: './build',
    filename: '[name].js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/manifest.json', to: 'manifest.json' },
    ]),
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
