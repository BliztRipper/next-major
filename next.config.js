const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withFonts = require('next-fonts')
const { ANALYZE } = process.env

module.exports = withFonts(withSass(withImages({
  webpack: function (config, { isServer }) {
    if (ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: isServer ? 8888 : 8889,
        openAnalyzer: true
      }))
    }
    return config
  }
})))