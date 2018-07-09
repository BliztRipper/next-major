import React, { Component } from 'react';
import Head from 'next/head'
import '../styles/style.scss';
import BottomNavBar from '../components/BottomNavBar'


export default class extends Component {
  componentDidMount () {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
          console.log('SW registered: ', registration)
        }).catch(function (registrationError) {
          console.log('SW registration failed: ', registrationError)
        })
      })
    }
  }

  render() {
    return(
      <div>
        <Head>
          <title>True Major Cineplex</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <h1 className='home-title'>Now Showing</h1>
        <BottomNavBar/>

      </div>
    )
   }
 }
