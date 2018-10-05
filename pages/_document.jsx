import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          {/* <link rel="stylesheet" href="/_next/static/css/style.css" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <noscript>Your browser does not support JavaScript!</noscript>
      </html>
    )
  }
}