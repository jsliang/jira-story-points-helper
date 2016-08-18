import CopyWebpackPlugin from 'copy-webpack-plugin';

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

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
  debug: !IS_PRODUCTION,
  devtool: IS_PRODUCTION ? 'cheap-source-map' : 'eval',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules|build/,
      loader: 'babel-loader',
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['src', 'node_modules'],
  },
};

module.exports = config;
