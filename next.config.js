const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withFonts = require('next-fonts')
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = withFonts(withSass(withImages({
  // webpack: (config) => {
  //   config.plugins.push(
  //     new SWPrecacheWebpackPlugin({
  //       verbose: true,
  //       staticFileGlobsIgnorePatterns: [/\.next\//],
  //       runtimeCaching: [
  //         {
  //           handler: 'networkFirst',
  //           urlPattern: /^https?.*/
  //         }
  //       ],
  //       optimization: {
  //         minimizer: [
  //           new UglifyJsPlugin({
  //             test: /\.js(\?.*)?$/i
  //           })
  //         ]
  //       }
  //     })
  //   )
  //   return config
  // }
  // optimization: {
  //   minimizer: [new UglifyJsPlugin()]
  // }
})))