import React, { Component } from 'react';
import Head from 'next/head'
import '../styles/style.scss';
import BottomNavBar from '../components/BottomNavBar'
import 'isomorphic-fetch'

export default class extends Component {
  static async getInitialProps() {
    const req = await fetch(`https://api.hackerwebapp.com/news`)
    const stories = await req.json()
    return {stories}
  }
  
  render() {
    return(
      <div>
        {/* {console.log(this.props.stories)} */}
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


