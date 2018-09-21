import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import Router from 'next/router'
import '../styles/style.scss'

class home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accid: false
    }
  }
  componentDidMount () {
    let urlParams = (new URL(document.location)).searchParams;
    let urlParamsAccid = urlParams.get('accid');
    let accid = urlParamsAccid ? urlParamsAccid : false
    Router.push({ pathname: '/', query: { accid: accid } })
    this.state.accid = accid

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
    const {accid} = this.state
    if (accid) {
      return(
        <Layout>
          <MainNavBar accid={accid} key="MainNavBar"/>
        </Layout>
      )
    } else {
      return false
    }
   }
 }
 export default home