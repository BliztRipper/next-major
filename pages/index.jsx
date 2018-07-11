import React, { Component } from 'react';
import Head from 'next/head'
import BottomNavBar from '../components/BottomNavBar'
import '../styles/style.scss'

export default class extends Component {
  componentDidMount () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('service worker registration successful')
        })
        .catch(err => {
          console.warn('service worker registration failed', err.message)
        })
    }
  }

  render() {
    return(
      <div>
        <Head>
          <title>True Major Cineplex</title>
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
        </Head>
        <h1 className='home-title'>Now Showing</h1>
        <BottomNavBar/>
        <style jsx global>{`
          body{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          .home-title{
            text-align: center;
          }
        `}
        </style>
      </div>
    )
   }
 }
