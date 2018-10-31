import React, { PureComponent, Fragment } from 'react';
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
      isLoading: true,
      notConsent:true
    }
  }
  componentDidMount() {
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

  renderSlide(){
    if (this.state.accid) {
      return <MainNavBar accid={this.state.accid} key="MainNavBar" />
    } else {
      return (
        <section className="empty">
          <img src={empty} />
        </section>
      )
    }
  }

  isConsent(){
    this.setState({
      notConsent:false
    })
  }

  render() {
    const { isLoading,notConsent } = this.state
    if (notConsent) {
      return (
        <Layout>
          <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',width:'100%',marginTop:'45%'}}>
            <img src="../static/m-pass@.png" width="64" alt="" style={{marginLeft:'120px'}}/>
            <img src="../static/swap.png" width="18" alt="" style={{margin: '0 1rem'}}/>
            <img src="../static/true-money.svg" width="64" alt="" style={{marginRight:'120px'}}/>
          </div>
          <div style={{marginTop:'4rem', textAlign:'center'}}>
            <p style={{color:'#333', fontSize:'1.2rem'}}>อนุญาตให้เข้าถึงข้อมูลทรูมันนี่ วอลเล็ท</p>
            <p style={{color:'#999'}}>เบอร์โทรศัพท์, หักเงินในบัญชีทรูมันนี่</p>
          </div>
          <button onClick={this.isConsent.bind(this)} style={{border: 'none', backgroundColor:'#ff8300',width:'100%',fontSize:'1rem', fontWeight:'bold',height:'2.8rem',color:'#fff',position:'fixed',bottom:0,left:0}}>อนุญาตดำเนินการ</button>
        </Layout>
      )
    }
    if (isLoading) {
      return false
    }
    if (isIOS){
      if(parseFloat(osVersion) < 10.3){
        return <h1 style={{textAlign:'center',fontSize:'24px', paddingTop:'2rem'}}>This feature require iOS version over 10.3<br/>Please update to newer version</h1>
      }
    }

    if (isAndroid){
      if(parseFloat(osVersion) <= 5.0) {
        return <h1 style={{textAlign:'center',}}>Your Android version is under 4.4, Please update to newer version</h1>
      }
    }
      return (
        <Layout>
          {this.renderSlide()}
        </Layout>
      )
  }
}
export default home