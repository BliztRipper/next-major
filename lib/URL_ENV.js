
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    'URL_PROD': 'https://api-cinema-pre.truemoney.net',
    'URL_PAYMENT_PROD': 'https://api-cinema-payment-pre.truemoney.net'
  }
} else {
  module.exports = {
    'URL_PROD': 'https://api-cinema.truemoney.net',
    'URL_PAYMENT_PROD': 'https://api-cinema.truemoney.net'
  }
}