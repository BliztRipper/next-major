import { PureComponent } from 'react'
import SeatMapDisplay from '../components/SeatMapDisplay'
import Layout from '../components/Layout'
import loading from '../static/loading.gif'
import Router from 'next/router'

class seatMap extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      theatre: '7',
      CinemaId: '',
      SessionId: '',
      dataObj: null,
      isLoading: true,
      error: null,
      areaData: null,
      ticketData: null
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
    this.state.theatre = `${this.props.url.query.ScreenNumber}`
    this.setState({
      CinemaId: this.state.CinemaId,
      SessionId: this.state.SessionId,
      theatre: this.state.theatre
    })
    if (this.state.SessionId === 'undefined') {
      this.goToHome()
    } else {
      this.getSeatPlans()
    }
  }
  getSeatPlans () {
    try{
      fetch(`https://api-cinema.truemoney.net/SeatPlan/${this.state.CinemaId}/${this.state.SessionId}`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data, isLoading: true}))
      .then(() => {
        this.mapArea()
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
      .then(data => this.setState({ticketData:data.data.Tickets, isLoading: false}))
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }    
  }
  mapArea () {
    this.setState({
      areaData: this.state.dataObj.SeatLayoutData.Areas
    })
  }
  handleBackButton () {
    console.log('back')
  }
  componentDidMount() {
    this.getTheatre()
  }
  render () {
    const {isLoading, error, areaData, ticketData, SessionId} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if (!areaData) {
      return false
    }
    return (
      <Layout>
        <div className="seatMap">
          <div className="seatMapHeader">
            <div className="seatMapHeader__button" onClick={this.handleBackButton}>&lt;</div>
            <div className="seatMapHeader__title">เลือกที่นั่ง</div>
          </div>
          <div className="seatMapScreen"><div className="seatMapScreen__inner"></div></div>
          <SeatMapDisplay areaData={areaData} ticketData={ticketData} SessionId={SessionId}></SeatMapDisplay>
        </div>
      </Layout>
    )
  }
}
export default seatMap