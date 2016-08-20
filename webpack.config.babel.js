import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

const config = {
  entry: {
    index: ['babel-polyfill', './src/index.js'],
  },
  output: {
    path: IS_PRODUCTION ? './dist' : './build',
    filename: '[name].js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/_locales', to: '_locales' },
      { from: './src/icon.png'},
      { from: './src/manifest.json' },
    ]),
    new webpack.optimize.UglifyJsPlugin({
      beautify: !IS_PRODUCTION,
      comments: !IS_PRODUCTION,
      compress: IS_PRODUCTION
        ? { warnings: false }
        : false,
      mangle: IS_PRODUCTION,
      sourceMap: !IS_PRODUCTION,
    }),
  ],
  debug: !IS_PRODUCTION,
  devtool: IS_PRODUCTION ? 'cheap-source-map' : 'eval',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules|build|dist/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
      },
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['src', 'node_modules'],
  },
};

if (IS_PRODUCTION) {
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  config.plugins.push(new webpack.optimize.DedupePlugin());
}

module.exports = config;
