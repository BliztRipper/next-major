import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import Router from 'next/router'
import '../styles/style.scss'

export default class home extends PureComponent {

  componentDidMount () {
    if (!this.props.url.query.accid) {
      Router.push({
        pathname: '/',
        query: {
          accid: '0863693746'
        }
      })
    }
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
        <MainNavBar accid={this.props.url.query.accid}/>
      </Layout>
    )
   }
 }
