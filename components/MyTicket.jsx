import {PureComponent} from 'react'
import Ticket from './Ticket'
import loading from '../static/loading.gif'
import empty from '../static/emptyTicket.png'
import Link from 'next/link'

class MyTicket extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isEmpty:true,
      error: null,
      userPhoneNumber: '0863693746',
      dataMyTicket: {}
    }
    this.refTicket = React.createRef()
  }
  getTickets () {
    try{
      fetch(`https://api-cinema.truemoney.net/MyTickets/${this.state.userPhoneNumber}`)
      .then(response => response.json())
      .then(data => {
        console.log(data, 'data RESPONSE MyTickets')
        this.setState({ 
          dataMyTicket: data.data,
          isLoading: false 
        })
      })
      if(this.state.dataMyTicket.length <= 0){
        this.setState({isEmpty:true})
      }
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }    
  }
  renderTickets () {
    if (this.state.dataMyTicket) {
      return this.state.dataMyTicket.map((item) => {
        return (
          <Ticket ref={this.refTicket} dataTicket={item} key={item.VistaBookingId} hideButton={true}></Ticket>
        )
      })
    }
  }
  componentWillMount() {
    // this.getTickets()

    // dummy api
    this.state.isLoading = false
    this.state.isEmpty = false
    this.state.dataMyTicket = []
    for (let index = 0; index < 3; index++) {
      this.state.dataMyTicket.push({
        BookingPoster: 'https://www.majorcineplex.com/uploads/movie/2418/thumb_2418.jpg',
        BookingMovie: 'Destination Wedding',
        BookingMovieTH: 'ไปงานแต่งเขา แต่เรารักกัน',
        BookingGenre: 'Comedy/Drama/Romance',
        BookingDuration: 86,
        BookingCinema: 'Dummy Cinema',
        BookingTime: '00:01',
        BookingScreenName: 'Dummy Screen Name',
        BookingSeat: 'Dummy Seats',
        BookingAttributesNames: 'Dummy AttributesNames',
        BookingPriceDisplay: 100,
        VistaBookingNumber: 'VistaBookingNumber',
        VistaBookingId: 'VistaBookingId'
      })
    }
  }
  render () {
    const {isLoading, error,isEmpty} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5></section>
    }   
    return (
      <div className="myTickets">
        <header className="cashier-header">ตั๋วของฉัน</header>
        {this.renderTickets()}
        <Link prefetch href="/HistoryTickets"><u>ดูประวัติการใช้งาน</u></Link>
      </div>
    )
  }
}
export default MyTicket;