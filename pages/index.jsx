import React, { Component } from 'react';
import Head from 'next/head'
import '../style.scss';
import BottomNavBar from '../components/BottomNavBar'


export default class extends Component {

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
