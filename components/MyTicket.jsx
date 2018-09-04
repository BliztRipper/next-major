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
    let expiredMaxHours = 3
    let offsetTime = expiredMaxHours * 3600 * 1000
    
    let serverResulTime = serverDate.getTime()
    if (this.state.dataMyTicket) {
      return this.state.dataMyTicket.map((ticket, ticketIndex) => {
        let ticketBookedResultTime = utilities.getStringDateTimeFromTicket(ticket.BookingDate, ticket.BookingTime).date.getTime()
        expired = serverResulTime - ticketBookedResultTime > offsetTime
        return (
          <Ticket ref={this.refTicket} dataTicket={ticket} key={ticket.VistaBookingId + ticketIndex} expired={expired} hideButton={true}></Ticket>
        )
      })
    }
  }
  componentWillMount() {
    this.getTickets()

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