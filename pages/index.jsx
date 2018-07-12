import React, { Component } from 'react';
import Layout from '../components/Layout'
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
      <Layout>
        <BottomNavBar/>
        <style jsx global>{`
          body{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
        `}
        </style>
      </Layout>
    )
   }
 }
