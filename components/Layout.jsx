import Head from 'next/head'

export default ({ children, title = 'True Major Cineplex' }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="" />
      <link rel="manifest" href="/static/manifest.webmanifest" />
      <meta name="theme-color" content="#ff6600" />
      <link rel="shortcut icon" href="/static/icon.png" />
      <link rel="apple-touch-icon" href="/static/icon.png" />
      <meta name="apple-mobile-web-app-title" content="True Major Cineplex" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    </Head>
    { children }
  </div>
)