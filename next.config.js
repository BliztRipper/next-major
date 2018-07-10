const withSass = require('@zeit/next-sass')
module.exports = withSass()

const {exportPathMap} = require('next-export-path-map')
module.exports = {
  exportPathMap
}