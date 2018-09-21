import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import empty from '../static/emptyTicket.png'
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

    this.setState({accid:userInfo.accid})

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
    return(
      <Layout>
        {(() => {
          if (accid) {
            return <MainNavBar accid={accid} key="MainNavBar"/>
          } else {
            return (
              <section className="empty">
                <img src={empty}/>
                <h5>ข้อมูลไม่ถูกต้อง</h5>
              </section>
            )
          }
        })()}
      </Layout>
    )
   }
 }
 export default home