const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withFonts = require('next-fonts')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { ANALYZE } = process.env
const withOffline = require('next-offline')
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');


module.exports = withPlugins([
  [optimizedImages, {
    inlineImageLimit: 8192,
    imagesFolder: 'static',
    imagesName: '[name]-[hash].[ext]',
    optimizeImagesInDev: false,
    mozjpeg: {
        quality: 80,
    },
    optipng: {
        optimizationLevel: 3,
    },
    pngquant: false,
    gifsicle: {
        interlaced: true,
        optimizationLevel: 3,
    },
    svgo: {

    },
    webp: {
        preset: 'default',
        quality: 75,
    },
  }],
  {
    webpack: function (cfg) {
      const originalEntry = cfg.entry
      cfg.entry = async () => {
        const entries = await originalEntry()
        if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
          entries['main.js'].unshift('./client/polyfills.js')
        }
        return entries
      }

      return cfg
    }
  },
  withOffline(withFonts(withImages(withSass({
    webpack: function (config, { isServer }) {
      if (ANALYZE) {
        config.plugins.push(new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true
        }))
      }
      return config
    }
  }))))
]);
