import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import empty from '../static/emptyTicket.png'
import loading from '../static/loading.svg'
import '../styles/style.scss'

class home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accid: false,
      isLoading: true
    }
  }
  componentDidMount () {
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
    const {accid, isLoading} = this.state
    if (isLoading) {
      return <div className="loadingWrap"><img src={loading} className="loading"/></div>
    }
    return(
      <Layout>
        {(() => {
          if (accid) {
            return <MainNavBar accid={accid} key="MainNavBar"/>
          } else {
            return (
              <section className="empty">
                <img src={empty}/>
              </section>
            )
          }
        })()}
      </Layout>
    )
   }
 }
 export default home