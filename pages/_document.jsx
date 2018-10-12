import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
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