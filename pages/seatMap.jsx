import React, { PureComponent, Fragment } from 'react'
import SeatMapDisplay from '../components/SeatMapDisplay'
import OTP from '../components/OTP'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import Router from 'next/router'
import '../styles/style.scss'
import Swal from 'sweetalert2'
import { CSSTransition } from 'react-transition-group'
import { URL_PROD, URL_PAYMENT_PROD, API_KEY } from '../lib/URL_ENV';


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
      seatsCounter: 0,
      otpShow: false,
      showPopupEducate: true,
      userInfo: '',
      userAuthData: null,
      apiOtpHeader: {
        'X-API-Key': `${API_KEY}`,
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
      fetch(`${URL_PROD}/CancelOrder`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(dataToCancelOrder)
      })
      .then(response => response.json())
      .then(() =>  {
        this.getTheatre()
        sessionStorage.removeItem('BookingCurrentServerTime')
        sessionStorage.removeItem('BookingUserSessionId')
        sessionStorage.removeItem('BookingUserPhoneNumber')
        sessionStorage.removeItem('BookingPrice')
        sessionStorage.removeItem('BookingPriceDisplay')
        sessionStorage.removeItem('BookingSeat')
        sessionStorage.removeItem('BookingSeatTotal')
      })
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
        imageUrl: '../static/error.svg',
        imageWidth: 200,
        imageHeight: 200,
        text: 'คุณไม่ได้เลือกโรงภาพยนตร์',
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
      fetch(`${URL_PROD}/SeatPlan/${this.state.CinemaId}/${this.state.SessionId}`)
      .then(response => response.json())
      .then(data => {
        if (data.status_code === 0 || data.description === 'Success') {
          this.state.dataSeatPlan = data.data
          this.getTickets()
        } else if (data.status_code === '25067' || data.description === 'Seat sold out') {
          Swal({
            title: 'ขออภัยในความไม่สะดวก',
            imageUrl: iconFilmEmpty,
            imageWidth: 200,
            imageHeight: 200,
            html: `รอบฉายที่คุณเลือกเต็มทุกที่นั่ง <br/> กรุณาเลือกรอบฉายอื่น` ,
            onAfterClose: () => {
              Router.back()
            }
          })
        } else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: '../static/error.svg',
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
      fetch(`${URL_PROD}/TicketPrices/${this.state.CinemaId}/${this.state.SessionId}`)
      .then(response => response.json())
      .then(data => {
        if (data.status_code === 0 || data.description === 'Success') {
          let matchTicketData = []
          let matchTicketIndex = 0
          this.state.dataSeatPlan.SeatLayoutData.Areas.forEach((area) => {
            let tickets = data.data.Tickets.filter((ticket) => {
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
            imageUrl: '../static/error.svg',
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
  authOtpHasToken (seatsSelected, seatsCounter) {
    this.state.seatsSelected = seatsSelected
    this.state.seatsCounter = seatsCounter
    this.refSeatMapDisplay.current.setState({postingTicket: true})
    try {
      fetch(`${URL_PAYMENT_PROD}/HasToken/${this.state.userInfo.accid}`,{
        headers: this.state.apiOtpHeader
      })
      .then(response => response.json())
      .then((data) =>  {
        if (data.status_code === 0 || data.description === 'Success') {
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
      fetch(`${URL_PAYMENT_PROD}/AuthApply/${this.state.userInfo.accid}`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then((data) =>  {
        if (data.status_code === 0 || data.description === 'Success') {
          this.state.userAuthData = {
            mobileno: this.state.userInfo.mobileno,
            ...data
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
              otpMatchCode: data.otp_ref,
              otpResendMsg: btnResendMsgPrev,
              otpResending: false
            })
          }
        } else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: '../static/error.svg',
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
      fetch(`${URL_PAYMENT_PROD}/AuthVerify/${this.state.userInfo.accid}`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then((data) =>  {
        if (data.status_code === 0 || data.description === 'Success') {
          this.bookSelectedSeats()
        } else if (data.status_code === 35000 && data.description.slice(0,7) === 'OAU0010') {
          Swal({
            title: 'รหัส OTP ไม่ถูกต้อง',
            imageUrl: '../static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            grow:'fullscreen',
            html: `Error Code: ${data.description.slice(0,7)}` ,
            confirmButtonText: 'ขอรหัส OTP อีกครั้ง',
            onAfterClose: () => {
              this.authOtpGetOtp(true)
            }
          })
        }else if (data.status_code === 35000){
          Swal({
            title: 'ขออภัยระบบขัดข้อง',
            imageUrl: '../static/error.svg',
            imageWidth: 200,
            imageHeight: 200,
            html: `เกิดข้อผิดพลาด ไม่สามารถทำรายการได้ในขณะนี้<br/>กรุณาลองใหม่อีกครั้ง<br/>CODE:${data.description.slice(0,7)}` ,
            onAfterClose: () => {
              Router.back()
            }
          })
        }else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: '../static/error.svg',
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
  bookSelectedSeats (isChaining) {
    let dataToStorage = {
      cinemaId: '',
      SessionId: '',
      ticketTypeCode: '',
      qty: 0,
      priceInCents: 0,
      SelectedSeats: []
    }
    this.state.seatsSelected.forEach((aSeatSelected, aSeatSelectedIndex, aSeatSelectedArray) => {

      let data = {
        cinemaId: aSeatSelected.ticket.CinemaId,
        priceInCents: aSeatSelected.ticket.PriceInCents,
        ticketTypeCode: aSeatSelected.ticket.TicketTypeCode,
        qty: this.state.seatsCounter,
        SessionId: this.state.SessionId
      }
      dataToStorage = {...dataToStorage, ...data}
      dataToStorage.SelectedSeats.push({
        AreaCategoryCode: aSeatSelected.ticket.AreaCategoryCode,
        ...aSeatSelected.Position
      })

    });
    try {
      fetch(`${URL_PROD}/AddTicket`,{
        method: 'POST',
        body:JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then((data) =>  {
        if (data.status_code === 0 || data.description === 'Success') {
          this.setState({ dataBookedSeats: data })
          Router.push({
            pathname: '/Cashier'
          })
          sessionStorage.setItem('BookingCurrentServerTime', data.server_time)
          sessionStorage.setItem('BookingUserSessionId', data.data.Order.UserSessionId)
          sessionStorage.setItem('BookingUserPhoneNumber', this.state.userInfo.mobileno)
        } else {
          Swal({
            title: 'ไม่สามารถทำรายการได้',
            imageUrl: '../static/error.svg',
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
  educateAccepted () {
    this.setState({
      showPopupEducate: false
    })
    this.state.userInfo.zoom = true
    sessionStorage.setItem('userInfo', JSON.stringify(this.state.userInfo))
    fetch(`${URL_PROD}/AddZoom/${this.state.userInfo.accid}`)
  }
  renderEducate () {
    return(
      <div className="seatMap__educate" onClick={this.educateAccepted.bind(this)}>
        <div className="seatMap__educate-inner">
          <figure><img src="../static/icon-pinch.svg" alt=""/></figure>
          <div className="seatMap__educate-desc">เพื่อขยายที่นั่ง</div>
          <div className="seatMap__educate-button" onClick={this.educateAccepted.bind(this)}>
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
    let userSessionId = sessionStorage.getItem('BookingUserSessionId')
    let instantUserInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    this.setState({
      userInfo: instantUserInfo,
      showPopupEducate: !instantUserInfo.zoom
    })
    if (userSessionId) {
      this.setState({
        isLoading: true
      })
      this.cancelOrder(userSessionId)
    } else {
      this.getTheatre()
    }
  }
  render () {
    const {isLoading, error, areaData, ticketData, SessionId, otpShow, userAuthData, userInfo, showPopupEducate} = this.state;
    let seatMapClassName = 'seatMap'
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <div className="loadingWrap"><img src="../static/loading.svg" className="loading"/></div>
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
                  in={showPopupEducate}
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
                <img src="../static/icon-film-empty.svg" />
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