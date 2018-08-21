import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import '../styles/style.scss'

export default class extends PureComponent {
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
    window.phoneNumber = '0891916415'
  }
  render() {
    return(
      <Layout>
        <MainNavBar/>
      </Layout>
    )
   }
 }
