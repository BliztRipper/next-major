import { PureComponent } from 'react'
import SeatMapDisplay from '../components/SeatMapDisplay'
import OTP from '../components/OTP'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import loading from '../static/loading.gif'
import Router from 'next/router'
import '../styles/style.scss'

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
      otpShow: false
    }
  }
  goToHome () {
    Router.push({
      pathname: '/'
    })
  }
  getTheatre () {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      try{
        fetch(`https://api-cinema.truemoney.net/Schedule`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({cinemaId: this.state.CinemaId})          
        })
        .then(response => response.json())
        .then(data => {
          this.setState({ isLoading: false })
          this.state.CinemaId = '0000000002'
          this.state.SessionId = data.data[0].Theaters['3'].SessionId
          this.getSeatPlans()
        })
      } catch(err){
        error => this.setState({ error, isLoading: false })
      }
    } else {
      this.state.CinemaId = sessionStorage.getItem('CinemaID')
      this.state.SessionId = `${this.props.url.query.SessionId}`
      if (this.state.SessionId === 'undefined') {
        this.goToHome()
      } else {
        this.getSeatPlans()
      }
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
        this.state.ticketData = this.state.dataSeatPlan.SeatLayoutData.Areas.map((area, areaIndex) => {
          if (area.AreaCategoryCode === data.data.Tickets[areaIndex].AreaCategoryCode) {
            return data.data.Tickets[areaIndex]
          }
        })
        this.mapArea()
        this.setState({isLoading: false})
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }    
  }
  mapArea () {
    this.setState({
      dataSeatPlan: this.state.dataSeatPlan,
      areaData: this.state.dataSeatPlan.SeatLayoutData.Areas,
      ticketData: this.state.ticketData
    })
  }
  handleBackButton () {
    Router.back()
  }
  handleAddedTicket () {
    this.setState({otpShow: true})
  }
  componentDidMount() {
    this.getTheatre()
  }
  render () {
    const {isLoading, error, areaData, ticketData, SessionId, otpShow} = this.state;
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
          <OTP></OTP>
        </Layout>
      )
    }
    return (
      <Layout title="Select Seats">
        <div className="seatMap">
          <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="เลือกที่นั่ง"></GlobalHeader>
          <SeatMapDisplay areaData={areaData} ticketData={ticketData} SessionId={SessionId} handleAddedTicket={this.handleAddedTicket.bind(this)}></SeatMapDisplay>
        </div>
      </Layout>
    )
  }
}
export default seatMap