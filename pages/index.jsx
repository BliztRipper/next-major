import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import empty from '../static/emptyTicket.png'
import '../styles/style.scss'
import {isIOS, isAndroid, osVersion} from "react-device-detect";

class home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accid: false,
      isLoading: true
    }
  }
  componentDidMount() {
    if (isIOS){
      if(parseFloat(osVersion) < 10.3){
        return <h1 style={{textAlign:'center',fontSize:'24px', paddingTop:'2rem',}}>Your iOS version is under 10.3, Please update to newer version</h1>
      }
    }

    if (isAndroid){
      if(parseFloat(osVersion) <= 5.0) {
        return <h1 style={{textAlign:'center',}}>Your Android version is under 4.4, Please update to newer version</h1>
      }
    }
    let urlParams = (new URL(document.location)).searchParams;
    let userInfo = null
    let accid = urlParams.get('accid')
    if (!accid) {
      userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    } else {
      userInfo = {
        accid: urlParams.get('accid'),
        mobileno: urlParams.get('mobileno'),
        distinctid: urlParams.get('distinctid')
      }
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    }

    this.setState({
      isLoading: false,
      accid: userInfo.accid
    })

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
    const { accid, isLoading } = this.state
    if (isLoading) {
      return false
    }
      return (
        <Layout>
          {(() => {
            if (accid) {
              return <MainNavBar accid={accid} key="MainNavBar" />
            } else {
              return (
                <section className="empty">
                  <img src={empty} />
                </section>
              )
            }
          })()}
        </Layout>
      )
  }
}
export default home