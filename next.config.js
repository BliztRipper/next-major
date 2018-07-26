const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withOffline = require('next-offline')

module.exports = withSass(withImages())