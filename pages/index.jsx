import React, { Component } from 'react';
import Head from 'next/head'
import BottomNavBar from '../components/BottomNavBar'


export default class extends Component {
  componentDidMount () {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js')
          .then(function() {
            console.log('Service Worker Registered');
          });
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
