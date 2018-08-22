import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import '../styles/style.scss'

export default class home extends PureComponent {
  componentWillMount () {
    console.log(`${this.props.url.query.phoneNumber}`)
  }
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
        <MainNavBar/>
      </Layout>
    )
   }
 }
