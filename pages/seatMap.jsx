import { PureComponent } from 'react'
import SeatMapDisplay from '../components/SeatMapDisplay'
import Layout from '../components/Layout'
import loading from '../static/loading.gif'
import './SeatMap.scss'

class seatMap extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      sessionID: '', 
      theatre: '5',
      theatreData: '',
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
      filmIds: ['HO00003343']
    }
    try{
      fetch(`http://api-cinema.truemoney.net/Schedule`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(dataPostSchedule)
      })
      .then(response => response.json())
      .then((data) => {
        this.setState({theatreData: data.data[0].Theaters[this.state.theatre]})
        this.getSeatPlans()
    })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  getSeatPlans () {
    try{
      fetch(`http://api-cinema.truemoney.net/SeatPlan/0000000002/${this.state.theatreData.SessionId}`)
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
      fetch(`http://api-cinema.truemoney.net/TicketPrices/0000000002/${this.state.theatreData.SessionId}`)
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
  render () {
    const {isLoading, error, areaData, ticketData} = this.state;
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
          <div className="seatMapScreen">
            <div className="seatMapScreen__inner">

            </div>
          </div>
          <SeatMapDisplay areaData={areaData} ticketData={ticketData} theatreData={this.state.theatreData}></SeatMapDisplay>
        </div>
      </Layout>
    )
  }
}
export default seatMap