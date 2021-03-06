import React, { PureComponent, Fragment } from 'react'
import SeatMapDisplay from '../components/SeatMapDisplay'
import OTP from '../components/OTP'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import loading from '../static/loading.svg'
import Router from 'next/router'
import '../styles/style.scss'
import Swal from 'sweetalert2'
import { CSSTransition } from 'react-transition-group'
import empty from '../static/emptyTicket.png'
import axios from 'axios'


class seatMap extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      serverTime: '',
      CinemaId: '',
      SessionId: '',
      dataSeatPlan: null,
      isLoading: true,
      error: null,
      areaData: null,
      ticketData: null,
      dataBookedSeats: null,
      seatsSelected: null,
      otpShow: false,
      entrySeatMap: false,
      userInfo: '',
      userAuthData: null,
      apiOtpHeader: {
        'X-API-Key': '085c43145ffc4727a483bc78a7dc4aae',
      }
    }
    this.refSeatMapDisplay = React.createRef()
    this.refOTP = React.createRef()
  }
  cancelOrder (UserSessionId) {
    let dataToCancelOrder =  {
      UserSessionId: UserSessionId
    }
    try{
      axios(`https://api-cinema.truemoney.net/CancelOrder`,{
        method: 'post',
        headers: this.state.apiOtpHeader,
        data: JSON.stringify(dataToCancelOrder)
      })
      .then(() =>  {
        this.setState({ isLoading: false })
      })
      sessionStorage.removeItem('BookingCurrentServerTime')
      sessionStorage.removeItem('BookingUserSessionId')
      sessionStorage.removeItem('BookingUserPhoneNumber')
      sessionStorage.removeItem('BookingPrice')
      sessionStorage.removeItem('BookingPriceDisplay')
      sessionStorage.removeItem('BookingSeat')
      sessionStorage.removeItem('BookingSeatTotal')
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  goToHome () {
    Router.push({
      pathname: '/'
    })
  }
  getTheatre () {
    this.state.CinemaId = sessionStorage.getItem('CinemaID')
    this.state.SessionId = `${this.props.url.query.SessionId}`
    if (this.state.SessionId === 'undefined') {
      Swal({
        title: 'ไม่สามารถทำรายการได้',
        imageUrl: './static/error.svg',
        imageWidth: 200,
        imageHeight: 200,
        text: 'คุณไม่ได้เลือกโรงภาพยนต์',
        confirmButtonText: this.goToHome(),
        showConfirmButton: false,
        timer: 3000
      })
    } else {
      this.getSeatPlans()
    }
    this.setState({
      CinemaId: this.state.CinemaId,
      SessionId: this.state.SessionId
    })
  }
  getSeatPlans () {
    try{
      axios(`https://api-cinema.truemoney.net/SeatPlan/${this.state.CinemaId}/${this.state.SessionId}`)
      .then(data => {
        if (data.data.status_code === 0 || data.data.description === 'Success') {
          this.state.dataSeatPlan = data.data.data
          this.getTickets()
        } else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: './static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240` ,
            onAfterClose: () => {
              Router.back()
            }
          })
        }
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  getTickets () {
    try{
      axios(`https://api-cinema.truemoney.net/TicketPrices/${this.state.CinemaId}/${this.state.SessionId}`)
      .then(data => {
        if (data.data.status_code === 0 || data.data.description === 'Success') {
          let matchTicketData = []
          let matchTicketIndex = 0
          this.state.dataSeatPlan.SeatLayoutData.Areas.forEach((area) => {
            let tickets = data.data.data.Tickets.filter((ticket) => {
              if (!ticket.seatTheme && !area.seatTheme && area.AreaCategoryCode === ticket.AreaCategoryCode ) {
                matchTicketIndex += 1
                ticket[`seatTheme`] = 'type' + matchTicketIndex
                area[`seatTheme`] = 'type' + matchTicketIndex
                return ticket
              }
            })
            if (tickets[0]) matchTicketData.push(tickets[0])
          })
          this.setState({
            dataSeatPlan: this.state.dataSeatPlan,
            areaData: this.state.dataSeatPlan.SeatLayoutData.Areas,
            ticketData: matchTicketData,
            isLoading: false
          })
        } else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: './static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240` ,
            onAfterClose: () => {
              Router.back()
            }
          })
        }
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  handleToggleZoomSeatsMap (e) {
    this.setState({
      entrySeatMap: true
    })
  }
  authOtpHasToken (seatSelected) {
    this.state.seatsSelected = seatSelected
    this.refSeatMapDisplay.current.setState({postingTicket: true})
    try {
      axios(`https://api-cinema.truemoney.net/HasToken/${this.state.userInfo.accid}`,{
        headers: this.state.apiOtpHeader
      })
      .then((data) =>  {
        if (data.data.status_code === 0 || data.data.description === 'Success') {
          this.bookSelectedSeats(true)
        } else {
          this.authOtpGetOtp(true)
        }
      })
    } catch (error) {
      console.error('error', error);
    }
  }
  authOtpGetOtp (isChaining) {
    let dataToStorage = {
      mobile_number: this.state.userInfo.mobileno,
      tmn_account: this.state.userInfo.mobileno
    }
    let btnResendMsgPrev = ''
    if (this.refOTP.current) {
      btnResendMsgPrev = this.refOTP.current.state.otpResendMsg
      this.refOTP.current.setState({
        otpResendMsg: 'กำลังเดินการ...',
        otpResending: true
      })
    }

    try {
      axios(`https://api-cinema.truemoney.net/AuthApply/${this.state.userInfo.accid}`,{
        method: 'post',
        headers: this.state.apiOtpHeader,
        data: JSON.stringify(dataToStorage)
      })
      .then((data) =>  {
        if (data.data.status_code === 0 || data.data.description === 'Success') {
          this.state.userAuthData = {
            mobileno: this.state.userInfo.mobileno,
            ...data.data
          }
          if (isChaining) {
            if (this.refSeatMapDisplay.current) {
              this.refSeatMapDisplay.current.setState({
                postingTicket: false
              }, () => {
                this.setState({
                  otpShow: true
                })
              })
            } else {
              this.setState({
                isLoading: false,
                otpShow: true
              })
            }
          } else {
            this.refOTP.current.setState({
              otpMatchCode: data.data.otp_ref,
              otpResendMsg: btnResendMsgPrev,
              otpResending: false
            })
          }
        } else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: './static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240` ,
            onAfterClose: () => {
              Router.back()
            }
          })
        }
      })
    } catch (error) {
      console.error('error', error);
    }
  }
  authOtpVerify (otpCode) {
    this.setState({isLoading: true})
    let userAuthData = this.state.userAuthData
    let dataToStorage = {
      otp_ref: userAuthData.otp_ref,
      otp_code: otpCode,
      agreement_id: userAuthData.agreement_id,
      auth_code: userAuthData.auth_code,
      tmn_account : userAuthData.mobileno
    }
    try {
      axios(`https://api-cinema.truemoney.net/AuthVerify/${this.state.userInfo.accid}`,{
        method: 'post',
        headers: this.state.apiOtpHeader,
        data: JSON.stringify(dataToStorage)
      })
      .then((data) =>  {
        if (data.data.status_code === 0 || data.data.description === 'Success') {
          this.bookSelectedSeats()
        } else if (data.data.status_code === 35000 && data.data.description.slice(0,7) === 'OAU0010') {
          Swal({
            title: 'รหัส OTP ไม่ถูกต้อง',
            imageUrl: './static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            grow:'fullscreen',
            html: `Error Code: ${data.data.description.slice(0,7)}` ,
            confirmButtonText: 'ขอรหัส OTP อีกครั้ง',
            onAfterClose: () => {
              this.authOtpGetOtp(true)
            }
          })
        }else if (data.data.status_code === 35000){
          Swal({
            title: 'ขออภัยระบบขัดข้อง',
            imageUrl: './static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            text: `เกิดข้อผิดพลาด ไม่สามารถทำรายการได้ในขณะนี้<br/>กรุณาลองใหม่อีกครั้ง<br/>CODE:${data.data.description.slice(0,7)}` ,
            onAfterClose: () => {
              Router.push('/')
            }
          })
        }else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: './static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240` ,
            onAfterClose: () => {
              Router.back()
            }
          })
        }
      })
    } catch (error) {
      console.log(error, 'error');
      console.error('error', error);
    }
  }
  bookSelectedSeats (isChaining) {
    let dataToStorage = {
      cinemaId: '',
      SessionId: '',
      ticketTypeCode: '',
      qty: 0,
      priceInCents: 0,
      SelectedSeats: []
    }
    this.state.seatsSelected.forEach((item, index, array) => {
      let data = {
        cinemaId: item.ticket.CinemaId,
        priceInCents: item.ticket.PriceInCents,
        ticketTypeCode: item.ticket.TicketTypeCode,
        qty: array.length,
        SessionId: this.state.SessionId
      }
      dataToStorage = {...dataToStorage, ...data}
      dataToStorage.SelectedSeats.push({
        AreaCategoryCode: item.ticket.AreaCategoryCode,
        ...item.Position
      })
    });
    try {
      axios(`https://api-cinema.truemoney.net/AddTicket`,{
        method: 'post',
        data:JSON.stringify(dataToStorage)
      })
      .then((data) =>  {
        if (data.data.status_code === 0 || data.data.description === 'Success') {
          this.setState({ dataBookedSeats: data.data })
          Router.push({
            pathname: '/Cashier'
          })
          sessionStorage.setItem('BookingCurrentServerTime', data.data.server_time)
          sessionStorage.setItem('BookingUserSessionId', data.data.data.Order.UserSessionId)
          sessionStorage.setItem('BookingUserPhoneNumber', this.state.userInfo.mobileno)
        } else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: './static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240` ,
            onAfterClose: () => {
              Router.back()
            }
          })
        }
      })
    } catch (error) {
      console.error('error', error);
    }
  }
  renderEducate () {
    return(
      <div className="seatMap__educate" onClick={this.handleToggleZoomSeatsMap.bind(this)}>
        <div className="seatMap__educate-inner">
          <figure><img src="../static/icon-pinch.png" alt=""/></figure>
          <div className="seatMap__educate-desc">เพื่อขยายที่นั่ง</div>
          <div className="seatMap__educate-button">
            <span className="btnTheme">เข้าใจแล้ว</span>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount () {
    sessionStorage.removeItem('previousRoute')
    let instantMovieSelect = sessionStorage.getItem('movieSelect')
    if (!instantMovieSelect) {
      this.goToHome()
    }
    this.getTheatre()
    let userSessionId = sessionStorage.getItem('BookingUserSessionId')
    this.setState({
      userInfo: JSON.parse(sessionStorage.getItem("userInfo"))
    })
    if (userSessionId) {
      this.setState({
        isLoading: true
      })
      this.cancelOrder(userSessionId)
    }
  }
  render () {
    const {isLoading, error, areaData, ticketData, SessionId, otpShow, userAuthData, entrySeatMap, userInfo} = this.state;
    let seatMapClassName = 'seatMap'
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <div className="loadingWrap"><img src={loading} className="loading"/></div>
    }
    if (!areaData) {
      return false
    }
    if (otpShow) {
      return (
        <Layout title="One-Time Password">
          <OTP
            ref={this.refOTP}
            userAuthData={userAuthData}
            authOtpGetOtp={this.authOtpGetOtp.bind(this)}
            authOtpVerify={this.authOtpVerify.bind(this)}
          ></OTP>
        </Layout>
      )
    }
    return (
      <Layout title="Select Seats">
        {(() => {
          if (userInfo.accid) {
            return (
              <Fragment>
                <div className={seatMapClassName}>
                  <GlobalHeader>เลือกที่นั่ง</GlobalHeader>
                  <SeatMapDisplay
                    ref={this.refSeatMapDisplay}
                    areaData={areaData}
                    SessionId={SessionId}
                    ticketData={ticketData}
                    authOtpHasToken={this.authOtpHasToken.bind(this)}
                    bookSelectedSeats={this.bookSelectedSeats.bind(this)}
                  ></SeatMapDisplay>
                </div>
                <CSSTransition
                  in={!entrySeatMap}
                  classNames="overlayEducate"
                  timeout={300}
                  unmountOnExit
                >
                  {this.renderEducate()}
                </CSSTransition>
              </Fragment>
            )
          } else {
            return (
              <section className="empty">
                <img src={empty} />
                <h5>ข้อมูลไม่ถูกต้อง</h5>
              </section>
            )
          }
        })()}
      </Layout>
    )
  }
}
export default seatMap