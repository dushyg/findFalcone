// const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
    // new webpack.DefinePlugin({
    //   'STABLE_FEATURE': JSON.stringify(true),
    //   'EXPERIMENTAL_FEATURE': JSON.stringify(false)
    // })
  ],
};
