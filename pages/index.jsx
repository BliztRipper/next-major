import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import Router from 'next/router'
import '../styles/style.scss'

class home extends PureComponent {
  componentDidMount () {
    let urlParams = (new URL(document.location)).searchParams;
    let urlParamsAccid = urlParams.get("accid");
    let accid = urlParamsAccid ? urlParamsAccid : '0863693746'
    Router.push({ pathname: '/', query: { accid: accid } })

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
 export default home