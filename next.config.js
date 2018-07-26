const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withOffline = require('next-offline')

module.exports = withSass(withImages(withOffline(
// {workboxOpts: {
//   runtimeCaching: [
//     {
//       urlPattern: /.png$/,
//       handler: 'cacheFirst'
//     },
//     {
//       urlPattern: /api/,
//       handler: 'networkFirst',
//       options: {
//         cacheableResponse: {
//           statuses: [0, 200],
//           headers: {
//             'x-test': 'true'
//             }
//           }
//         }
//       }
//     ]
//   }
// }
)))