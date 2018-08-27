import React, { PureComponent } from 'react'
import SeatMapDisplay from '../components/SeatMapDisplay'
import OTP from '../components/OTP'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import loading from '../static/loading.gif'
import Router from 'next/router'
import '../styles/style.scss'
import Swal from 'sweetalert2'

class seatMap extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
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
      userPhoneNumber: '0891916415',
      userAuthData: null,
      apiOtpHeader: {
        'Accept': 'application/json',
        'X-API-Key': '085c43145ffc4727a483bc78a7dc4aae',
        'Content-Type': 'application/json'
      }
    }
    this.refSeatMapDisplay = React.createRef()
    this.refOTP = React.createRef()
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
        let matchTicketData = this.state.dataSeatPlan.SeatLayoutData.Areas.map((area, areaIndex) => {
          if (data.data.Tickets[areaIndex]) return area.AreaCategoryCode === data.data.Tickets[areaIndex].AreaCategoryCode ? data.data.Tickets[areaIndex] : false
        }).filter(ticket => ticket ? ticket: '' )
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
  authOtpHasToken (seatSelected) {
    this.state.seatsSelected = seatSelected
    this.refSeatMapDisplay.current.setState({postingTicket: true})
    try {
      fetch(`https://api-cinema.truemoney.net/HasToken/${this.state.userPhoneNumber}`,{
        headers: this.state.apiOtpHeader
      })
      .then(response => response.json())
      .then((data) =>  {
        if (data.status_code === 200) {
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
        if (isChaining) {
          this.refSeatMapDisplay.current.setState({postingTicket: false})
        }
        console.log(data, 'data RESPONSE bookSelectedSeats')
        if (data.status_code !== 400) {
          this.setState({ dataBookedSeats: data })
          Router.push({ pathname: '/Cashier' })
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
      })
    } catch (error) {
      console.error('error', error);
    }
  }
  componentDidMount() {
    this.getTheatre()
  }
  render () {
    const {isLoading, error, areaData, ticketData, SessionId, otpShow, userAuthData} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
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
        <div className="seatMap">
          <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="เลือกที่นั่ง"></GlobalHeader>
          <SeatMapDisplay 
            ref={this.refSeatMapDisplay} 
            areaData={areaData} 
            SessionId={SessionId} 
            ticketData={ticketData} 
            authOtpHasToken={this.authOtpHasToken.bind(this)}
            bookSelectedSeats={this.bookSelectedSeats.bind(this)}
          ></SeatMapDisplay>
        </div>
      </Layout>
    )
  }
}
export default seatMap