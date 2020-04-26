const path = require('path');

module.exports = {
  target: 'webworker',
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.ts'],
    alias: {
      fs: path.resolve(__dirname, './null.js'),
    },
  },
};
