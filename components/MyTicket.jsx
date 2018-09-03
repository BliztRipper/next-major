import { PureComponent } from 'react'
import Ticket from './Ticket'
import loading from '../static/loading.gif'
import empty from '../static/emptyTicket.png'
import Link from 'next/link'
import sortTickets from '../scripts/sortTickets'

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
      serverTime: '2018-08-31T01:04:09Z',
      isLoading: true,
      isEmpty:true,
      error: null,
      userPhoneNumber: '0863693746',
      dataMyTicket: []
    }
    this.refTicket = React.createRef()
  }
  getStringDateTime (time) {
    let regexDateTime = RegExp('^([0-9]{4})-([0-9]{2})-([0-9]{2})[Tt]([0-9]{2}:[0-9]{2}).*$','g');
    let dateTimeArr = regexDateTime.exec(time)
    return {
      origin: dateTimeArr[0],
      year: dateTimeArr[1],
      month: dateTimeArr[2],
      day: dateTimeArr[3],
      time: dateTimeArr[4],
      hour: dateTimeArr[4].split(':')[0],
      minute: dateTimeArr[4].split(':')[1]
    }
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
    let expired = false
    let maxHourForExpried = 3
    let serverHourToMinute = (parseInt(this.getStringDateTime(this.state.serverTime).hour) + maxHourForExpried) * 60
    let serverMinute = parseInt(this.getStringDateTime(this.state.serverTime).minute)
    if (this.state.dataMyTicket) {
      return this.state.dataMyTicket.map((ticket, ticketIndex) => {
        let ticketBookedFromHourToMinute = parseInt(ticket.BookingTime.split(':')[0]) * 60
        let ticketBookedMinute = parseInt(ticket.BookingTime.split(':')[1]) - ticketIndex
        expired = ( ticketBookedFromHourToMinute + ticketBookedMinute ) > ( serverHourToMinute + serverMinute )
        return (
          <Ticket ref={this.refTicket} dataTicket={ticket} key={ticket.VistaBookingId} expired={expired} hideButton={true}></Ticket>
        )
      })
    }
  }
  componentWillMount() {
    // this.getTickets()

    // dummy api
    this.state.isLoading = false
    this.state.isEmpty = false
    this.state.dataMyTicket.push({
      BookingPoster: 'https://www.majorcineplex.com/uploads/movie/2418/thumb_2418.jpg',
      BookingMovie: 'Destination Wedding',
      BookingMovieTH: 'ไปงานแต่งเขา แต่เรารักกัน',
      BookingGenre: 'Comedy/Drama/Romance',
      BookingDuration: 86,
      BookingCinema: 'Dummy Cinema',
      BookingTime: '04:10',
      BookingScreenName: 'Dummy Screen Name',
      BookingSeat: 'Dummy Seats',
      BookingAttributesNames: 'Dummy AttributesNames',
      BookingPriceDisplay: 100,
      VistaBookingNumber: 'VistaBookingNumber Destination Wedding',
      VistaBookingId: 'VistaBookingId Destination Wedding'
    },
    {
      BookingPoster: 'https://www.majorcineplex.com/uploads/movie/2226/thumb_2226.jpg',
      BookingMovie: 'The Nun',
      BookingMovieTH: 'เดอะ นัน',
      BookingGenre: 'Horror/Thriller',
      BookingDuration: 96,
      BookingCinema: '0000000002',
      BookingTime: '04:12',
      BookingScreenName: 'Dummy Screen Name',
      BookingSeat: 'Dummy Seats',
      BookingAttributesNames: 'Dummy AttributesNames',
      BookingPriceDisplay: 600,
      VistaBookingNumber: 'VistaBookingNumber The Nun',
      VistaBookingId: 'VistaBookingId The Nun'
    },
    {
      BookingPoster: 'https://www.majorcineplex.com/uploads/movie/2253/thumb_2253.jpg',
      BookingMovie: 'Khun-Pun 2',
      BookingMovieTH: 'ขุนพันธ์ 2',
      BookingGenre: 'Action',
      BookingDuration: 130,
      BookingCinema: '0000000002',
      BookingTime: '04:07',
      BookingScreenName: 'Dummy Screen Name',
      BookingSeat: 'Dummy Seats',
      BookingAttributesNames: 'Dummy AttributesNames',
      BookingPriceDisplay: 400,
      VistaBookingNumber: 'VistaBookingNumber Khun-Pun 2',
      VistaBookingId: 'VistaBookingId Khun-Pun 2'
    })
    // this.state.dataMyTicket = sortTickets.byTime(this.state.dataMyTicket)
    this.state.dataMyTicket = sortTickets.byName(this.state.dataMyTicket)
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