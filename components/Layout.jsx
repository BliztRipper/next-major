import Head from 'next/head'
import React, { Fragment } from 'react';

const Layout = ({ children, title = 'True Major Cineplex' }) => (
  <Fragment>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=no, initial-scale=1.0, viewport-fit=cover"/>
      <meta name="description" content="" />
      <link rel="manifest" href="/static/manifest.webmanifest" />
      <meta name="theme-color" content="#ff6600" />
      <link rel="shortcut icon" href="/static/icon.png" />
      <link rel="apple-touch-icon" href="/static/icon.png" />
      <meta name="apple-mobile-web-app-title" content="True Major Cineplex" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.0/css/swiper.min.css" />
    </Head>
    { children }
  </Fragment>
)
export default Layout