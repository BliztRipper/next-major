const prod = process.env.NODE_ENV === 'production'

module.exports = {
  'process.env.GA': prod ? '' : ''
}


