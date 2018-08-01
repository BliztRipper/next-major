const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = withSass(withImages({
  webpack: (config) => {
    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        verbose: true,
        staticFileGlobsIgnorePatterns: [/\.next\//],
        runtimeCaching: [
          {
            handler: 'networkFirst',
            urlPattern: /^https?.*/
          }
        ]
      })
    )
    return config
  }
}))