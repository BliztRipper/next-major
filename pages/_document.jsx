import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PHNHLKK');</script>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PHNHLKK"height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
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