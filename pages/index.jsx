import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import empty from '../static/emptyTicket.png'
import '../styles/style.scss'
import {isIOS, isAndroid, osVersion} from "react-device-detect";
import VersionNotSupport from '../components/VersionNotSupport';
import axios from 'axios'
import Page from '../components/Page';
import { URL_PROD } from '../lib/URL_ENV';

class home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accid: false,
      isLoading: true,
      notConsent: false,
      underConstruction:false
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
    this.checkConsent(userInfo.accid)
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
  checkConsent (accid) {
    axios.get(`${URL_PROD}/UserInfo/${accid}`)
    .then(data => {
      if (data.data.data.concent) {
        this.setState({notConsent: false})
      } else {
        this.setState({notConsent: true})
      }
    }).catch (err => {
      this.setState({notConsent: true})
    })
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

  addConsent(){
    axios.get(`${URL_PROD}/AddConcent/${this.state.accid}`)
    .then(data => {
      if (data.data.status_code === 0 && data.data.description === 'Success') {
        this.setState({notConsent: false})
      }
    })
  }

  render() {
    const { isLoading,notConsent,underConstruction } = this.state
    if (isIOS){
      if(parseFloat(osVersion) < 10.3){
        return <VersionNotSupport/>
      }
    }

    if (isAndroid){
      if(parseFloat(osVersion) <= 5.0) {
        return <h1 style={{textAlign:'center',}}>Your Android version is under 4.4, Please update to newer version</h1>
      }
    }
    if (notConsent) {
      return (
        <Layout>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',marginTop:'45%'}}>
            <img src="../static/m-pass@.png" width="64" alt="" style={{marginLeft:'120px'}}/>
            <img src="../static/swap.png" width="18" alt="" style={{margin: '0 1rem'}}/>
            <img src="../static/true-money.svg" width="64" alt="" style={{marginRight:'120px'}}/>
          </div>
          <div style={{marginTop:'4rem', textAlign:'center'}}>
            <p style={{color:'#333', fontSize:'1.2rem'}}>อนุญาตให้เข้าถึงข้อมูลทรูมันนี่ วอลเล็ท</p>
            <p style={{color:'#999'}}>เบอร์โทรศัพท์, หักเงินในบัญชีทรูมันนี่</p>
            <p style={{color:'#999'}}>*รองรับระบบ iOS ตั้งแต่ 10.3 และ Android 4.4 ขึ้นไป</p>
          </div>
          <button onClick={this.addConsent.bind(this)} style={{border: 'none', backgroundColor:'#ff8300',width:'100%',fontSize:'1rem', fontWeight:'bold',height:'4rem',color:'#fff',position:'fixed',bottom:0,left:0}}>อนุญาตดำเนินการ</button>
        </Layout>
      )
    }
    if(underConstruction){
      return (
        <Layout>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',marginTop:'45%'}}>
            <img src="../static/error.svg" width="150" alt=""/>
          </div>
          <div style={{marginTop:'4rem', textAlign:'center'}}>
            <p style={{color:'#333', fontSize:'1.2rem'}}>ขออภัยระบบกำลังปรับปรุง</p>
            <p style={{color:'#999'}}>ขออภัยในความไม่สะดวก ขณะนี้ระบบกำลังปิดปรับปรุง</p>
          </div>
        </Layout>
      )
    }
    if (isLoading) {
      return false
    }
      return (
        <Page>
          <Layout>
            {this.renderSlide()}
          </Layout>
        </Page>
      )
  }
}
export default home