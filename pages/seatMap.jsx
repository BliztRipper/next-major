import { PureComponent } from 'react'
import SeatMapDisplay from '../components/SeatMapDisplay'
import Layout from '../components/Layout'
import loading from '../static/loading.gif'

class seatMap extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      sessionID: '', 
      theatre: '7',
      theatreData: '',
      theatreDataAll: '',
      dataObj: null,
      isLoading: true,
      error: null,
      areaData: null,
      ticketData: null
    }
    this.getSchedule()
  }
  getSchedule () {
    let dataPostSchedule = {
      cinemaId: '0000000002',
      filmIds: []
    }
    try{
      fetch(`https://api-cinema.truemoney.net/Schedule`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(dataPostSchedule)
      })
      .then(response => response.json())
      .then((data) => {
        this.setState(
          {
            theatreData: data.data[0].Theaters[this.state.theatre],
            theatreDataAll: data.data[0].Theaters
          })
        this.getSeatPlans()
    })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  getSeatPlans () {
    try{
      fetch(`https://api-cinema.truemoney.net/SeatPlan/0000000002/${this.state.theatreData.SessionId}`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data}))
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
      fetch(`https://api-cinema.truemoney.net/TicketPrices/0000000002/${this.state.theatreData.SessionId}`)
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
    console.log('mapArea')
  }
  handleBackButton () {
    console.log('back')
  }
  handleSwitchTheatre (key) {
    console.log(key, 'key')
    console.log(this)
    this.state.theatre = key
    this.getSchedule()
    this.setState({theatre: this.state.theatre})
  }
  render () {
    const {isLoading, error, areaData, ticketData, theatreData, theatreDataAll} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if (!areaData) {
      return false
    }
    let SwitchButtons = Object.keys(theatreDataAll).map((key) => {
      return (
        <div className="switchButton" onClick={this.handleSwitchTheatre.bind(this, key)} key={key + 'SwitchTheatre'}>
          <div>{key}</div>
        </div>
      )
    })
    return (
      <Layout>
        <div className="seatMap">
          <div className="seatMapHeader">
            <div className="seatMapHeader__button" onClick={this.handleBackButton}>&lt;</div>
            <div className="seatMapHeader__title">เลือกที่นั่ง</div>
          </div>
          <div className="seatMapScreen"><div className="seatMapScreen__inner"></div></div>
          <SeatMapDisplay areaData={areaData} ticketData={ticketData} theatreData={theatreData}></SeatMapDisplay>
          {/* <div className="seatLogs">
            <div className="titleText">LOGS >> โรง : {theatreData.ScreenNameAlt} ({theatreData.ScreenName})</div>
            <div className="switchButtons">
              {SwitchButtons}
            </div>
          </div> */}
        </div>
      </Layout>
    )
  }
}
export default seatMap