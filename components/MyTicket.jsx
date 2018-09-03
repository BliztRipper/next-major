import { PureComponent } from 'react'
import Ticket from './Ticket'
import loading from '../static/loading.gif'
import empty from '../static/emptyTicket.png'
import Link from 'next/link'
import sortTickets from '../scripts/sortTickets'
import utilities from '../scripts/utilities'

class ButtonHistory extends PureComponent {
  render () {
    return (
      <Link prefetch href="/HistoryTickets">
        <a href="" className="btnTheme"><span>ดูประวัติการใช้งาน</span></a>
      </Link>
    )
  }
}
class MyTicket extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      serverTime: '',
      isLoading: true,
      isEmpty:true,
      error: null,
      userPhoneNumber: '0863693746',
      dataMyTicket: []
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
          serverTime: data.server_time,
          isEmpty: false,
          isLoading: false 
        })
        if(this.state.dataMyTicket.length <= 0){
          this.setState({isEmpty:true})
        }
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }    
  }
  renderTickets () {
    let expired = false
    let serverDate = new Date(this.state.serverTime)
    let offsetTime = (3600 * 3 * 1000) // 3 hours
    
    let serverResulTime = serverDate.getTime()
    console.log(serverResulTime, 'serverResulTime');
    
    if (this.state.dataMyTicket) {
      return this.state.dataMyTicket.map((ticket, ticketIndex) => {
        // let ticketBookedFromHourToMinute = parseInt(ticket.BookingTime.split(':')[0]) * 60


        let ticketBookedYear = parseInt(ticket.BookingDate.split('/')[2])
        let ticketBookedMonth = parseInt(ticket.BookingDate.split('/')[1]) - 1
        let ticketBookedDay = parseInt(ticket.BookingDate.split('/')[0])
        let ticketBookedHour = parseInt(ticket.BookingTime.split(':')[0])
        let ticketBookedMinute = parseInt(ticket.BookingTime.split(':')[1]) - ticketIndex
        let ticketBookedDate = new Date(ticketBookedYear, ticketBookedMonth, ticketBookedDay, ticketBookedHour, ticketBookedMinute)
        let ticketBookedResultTime = ticketBookedDate.getTime()
        expired = serverResulTime - ticketBookedResultTime > offsetTime
        return (
          <Ticket ref={this.refTicket} dataTicket={ticket} key={ticket.VistaBookingId} expired={expired} hideButton={true}></Ticket>
        )
      })
    }
  }
  componentWillMount() {
    this.getTickets()

    // dummy api
    // this.state.isLoading = false
    // this.state.isEmpty = false
    // this.state.dataMyTicket.push({
    //   BookingPoster: 'https://www.majorcineplex.com/uploads/movie/2418/thumb_2418.jpg',
    //   BookingMovie: 'Destination Wedding',
    //   BookingMovieTH: 'ไปงานแต่งเขา แต่เรารักกัน',
    //   BookingGenre: 'Comedy/Drama/Romance',
    //   BookingDuration: 86,
    //   BookingCinema: 'Dummy Cinema',
    //   BookingTime: '01:10',
    //   BookingScreenName: 'Dummy Screen Name',
    //   BookingSeat: 'Dummy Seats',
    //   BookingAttributesNames: 'Dummy AttributesNames',
    //   BookingPriceDisplay: 100,
    //   VistaBookingNumber: 'VistaBookingNumber Destination Wedding',
    //   VistaBookingId: 'VistaBookingId Destination Wedding'
    // },
    // {
    //   BookingPoster: 'https://www.majorcineplex.com/uploads/movie/2226/thumb_2226.jpg',
    //   BookingMovie: 'The Nun',
    //   BookingMovieTH: 'เดอะ นัน',
    //   BookingGenre: 'Horror/Thriller',
    //   BookingDuration: 96,
    //   BookingCinema: '0000000002',
    //   BookingTime: '01:12',
    //   BookingScreenName: 'Dummy Screen Name',
    //   BookingSeat: 'Dummy Seats',
    //   BookingAttributesNames: 'Dummy AttributesNames',
    //   BookingPriceDisplay: 600,
    //   VistaBookingNumber: 'VistaBookingNumber The Nun',
    //   VistaBookingId: 'VistaBookingId The Nun'
    // },
    // {
    //   BookingPoster: 'https://www.majorcineplex.com/uploads/movie/2253/thumb_2253.jpg',
    //   BookingMovie: 'Khun-Pun 2',
    //   BookingMovieTH: 'ขุนพันธ์ 2',
    //   BookingGenre: 'Action',
    //   BookingDuration: 130,
    //   BookingCinema: '0000000002',
    //   BookingTime: '04:07',
    //   BookingScreenName: 'Dummy Screen Name',
    //   BookingSeat: 'Dummy Seats',
    //   BookingAttributesNames: 'Dummy AttributesNames',
    //   BookingPriceDisplay: 400,
    //   VistaBookingNumber: 'VistaBookingNumber Khun-Pun 2',
    //   VistaBookingId: 'VistaBookingId Khun-Pun 2'
    // })
    this.state.dataMyTicket = sortTickets.byTime(this.state.dataMyTicket)
    // this.state.dataMyTicket = sortTickets.byName(this.state.dataMyTicket)
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
      return (
        <section className="empty">
          <img src={empty}/>
          <h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5>
          <ButtonHistory></ButtonHistory>
        </section>
      )
    }   
    return (
      <div className="myTickets">
        <header className="cashier-header">ตั๋วของฉัน</header>
        {this.renderTickets()}
        <ButtonHistory></ButtonHistory>
      </div>
    )
  }
}
export default MyTicket;