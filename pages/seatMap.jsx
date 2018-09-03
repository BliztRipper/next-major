import React, { PureComponent } from 'react'
import isDblTouchTap from "../scripts/isDblTouchTap"
import SeatMapDisplay from '../components/SeatMapDisplay'
import OTP from '../components/OTP'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import loading from '../static/loading.gif'
import Router from 'next/router'
import '../styles/style.scss'
import Swal from 'sweetalert2'
import { CSSTransition } from 'react-transition-group'

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
      userPhoneNumber: '0863693746',
      userAuthData: null,
      apiOtpHeader: {
        'X-API-Key': '085c43145ffc4727a483bc78a7dc4aae'
      }
    }
    this.refSeatMapDisplay = React.createRef()
    this.refOTP = React.createRef()
    this.getStringDateTime('2018-08-31T06:03:09Z')
  }
  goToHome () {
    Router.push({
      pathname: '/'
    })
  }
  getStringDateTime (time) {
    let regexDateTime = RegExp('^([0-9]{4})-([0-9]{2})-([0-9]{2})[Tt]([0-9]{2}:[0-9]{2}).*$','g');
    let dateTimeArr = regexDateTime.exec(time)
    console.log(dateTimeArr);
    return {
      origin: dateTimeArr[0],
      year: dateTimeArr[1],
      month: dateTimeArr[2],
      day: dateTimeArr[3],
      time: dateTimeArr[4]
    }
  }
  getTheatre () {
    this.state.CinemaId = sessionStorage.getItem('CinemaID')
    this.state.SessionId = `${this.props.url.query.SessionId}`
    if (this.state.SessionId === 'undefined') {
      Swal({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
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
      fetch(`https://api-cinema.truemoney.net/SeatPlan/${this.state.CinemaId}/${this.state.SessionId}`)
      .then(response => response.json())
      .then(data => {
        this.state.dataSeatPlan = data.data
        this.getTickets()
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  getTickets () {
    try{
      fetch(`https://api-cinema.truemoney.net/TicketPrices/${this.state.CinemaId}/${this.state.SessionId}`)
      .then(response => response.json())
      .then(data => {
        let matchTicketData = []
        this.state.dataSeatPlan.SeatLayoutData.Areas.forEach((area) => {
          let tickets = data.data.Tickets.filter((ticket) => {
            if (area.AreaCategoryCode === ticket.AreaCategoryCode) return ticket
          })
          if (tickets[0]) matchTicketData.push(tickets[0])
        })

        this.setState({
          dataSeatPlan: this.state.dataSeatPlan,
          areaData: this.state.dataSeatPlan.SeatLayoutData.Areas,
          ticketData: matchTicketData,
          isLoading: false
        })
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }    
  }    
  handleBackButton () {
    Router.back()
  }
  handleToggleZoomSeatsMap (e) {
    if (isDblTouchTap(e)) {
      if (!this.state.entrySeatMap) {
        this.setState({
          entrySeatMap: true
        }, () => {
          this.refSeatMapDisplay.current.styleSeatsContainer()
        })
      } else {
        this.setState({
          entrySeatMap: false
        }, () => {
          this.refSeatMapDisplay.current.styleSeatsContainer()
        })
      }
    }
  }
  authOtpHasToken (seatSelected) {
    this.state.seatsSelected = seatSelected
    this.refSeatMapDisplay.current.setState({postingTicket: true})
    try {
      fetch(`https://api-cinema.truemoney.net/HasToken/${this.state.userPhoneNumber}`,{
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
      mobile_number: this.state.userPhoneNumber,
      tmn_account: this.state.userPhoneNumber
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
      fetch(`https://api-cinema.truemoney.net/AuthApply/${this.state.userPhoneNumber}`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then((data) =>  {
        this.state.userAuthData = {
          phoneNumber: this.state.userPhoneNumber,
          ...data
        }
        if (isChaining) {
          this.refSeatMapDisplay.current.setState({postingTicket: false})
          this.setState({otpShow: true})
        } else {
          this.refOTP.current.setState({
            otpMatchCode: data.otp_ref,
            otpResendMsg: btnResendMsgPrev,
            otpResending: false
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
      tmn_account : userAuthData.phoneNumber
    }
    try {
      fetch(`https://api-cinema.truemoney.net/AuthVerify/${userAuthData.phoneNumber}`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then(() =>  {
        this.bookSelectedSeats()
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
    console.log(dataToStorage, 'data POST AddTicket')
    try {
      fetch(`https://api-cinema.truemoney.net/AddTicket`,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then((data) =>  {
        console.log(data, 'data RESPONSE bookSelectedSeats')
        if (data.status_code !== 400) {
          this.setState({ dataBookedSeats: data })
          Router.push({ pathname: '/Cashier' })
          sessionStorage.setItem('BookingCurrentServerTime', data.server_time)
          sessionStorage.setItem('BookingUserSessionId', data.data.Order.UserSessionId)
          sessionStorage.setItem('BookingUserPhoneNumber', this.state.userPhoneNumber)
        } else if(data.status_code === 400 && data.description === 'Selected seats unavailable.') {
          Swal({
            type: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ที่นั่งที่คุณเลือกไม่สามารถจองได้',
            showConfirmButton: false,
            timer: 4000
          })
        }
        if (isChaining) {
          this.refSeatMapDisplay.current.setState({postingTicket: false})
        } else {
          this.setState({isLoading: false})
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
          ดับเบิ้ลคลิก
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.getTheatre()
  }
  render () {
    const {isLoading, error, areaData, ticketData, SessionId, otpShow, userAuthData, entrySeatMap} = this.state;
    let seatMapClassName = 'seatMap'
    if (!entrySeatMap) {
      seatMapClassName = seatMapClassName + ' beforeEntry'
    }
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
        <div className={seatMapClassName}>
          <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="เลือกที่นั่ง"></GlobalHeader>
          <SeatMapDisplay 
            ref={this.refSeatMapDisplay}
            areaData={areaData} 
            SessionId={SessionId} 
            ticketData={ticketData} 
            authOtpHasToken={this.authOtpHasToken.bind(this)}
            bookSelectedSeats={this.bookSelectedSeats.bind(this)}
            handleToggleZoomSeatsMap={this.handleToggleZoomSeatsMap.bind(this)}
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
      </Layout>
    )
  }
}
export default seatMap