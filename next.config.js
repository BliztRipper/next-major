const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withFonts = require('next-fonts')
const withBabelMinify = require('next-babel-minify')()

module.exports = withFonts(withSass(withImages(withBabelMinify())))