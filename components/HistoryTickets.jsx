import { PureComponent } from 'react'
import '../styles/style.scss'
import utilities from '../scripts/utilities'

class HistoryTickets extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isEmpty:true,
      error: null,
      serverTime: this.props.serverTime
    }

  }
  renderEachList (ticket, ticketIndex) {
    return (
      <div className="historyTickets__list" onClick={this.props.goToHistoryDetail.bind(this, ticketIndex)} key={ticket.BookingMovie + ticket.BookingFullDate + ticket.BookingTime + ticketIndex}>
        <div className="historyTickets__list-titleEN">{ticket.BookingMovie}</div>
        <div className="historyTickets__list-titleTH">{ticket.BookingMovieTH}</div>
        <div className="historyTickets__list-locationAndDate">
          <div className="historyTickets__list-location">{ticket.BookingCinema}</div>
          <div className="historyTickets__list-date">{ticket.BookingFullDate} ({ticket.BookingTime})</div>
        </div>
      </div>
    )
  }
  renderHistoryLists (ticketsGroupByMonth) {
    let lists = ticketsGroupByMonth.tickets.map((ticket, ticketIndex) => {
      return this.renderEachList(ticket, ticketIndex)
    })
    return lists
  }
  renderHistoryGroupByMonth () {
    let maxMonths = 3
    let listsMonth = [ 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม' ]
    let serverDate = utilities.getStringDateTime(this.state.serverTime).date
    let serverMonth = serverDate.getMonth()

    let ticketsGroupByMonths = {}
    this.props.dataTickets.map((ticket) => {
      let month = utilities.getStringDateTimeFromTicket(ticket.BookingFullDate, false).month
      let year = utilities.getStringDateTimeFromTicket(ticket.BookingFullDate, false).year
      let ticketDate = utilities.getStringDateTimeFromTicket(ticket.BookingFullDate, false).date
      let ticketMonth = ticketDate.getMonth()
      if (serverMonth - ticketMonth < maxMonths) {
        if (!ticketsGroupByMonths[year + '-' + month]) {
          ticketsGroupByMonths[year + '-' + month] = {
            monthName: listsMonth[month - 1],
            tickets: [ticket]
          }
        } else {
          ticketsGroupByMonths[year + '-' + month].tickets.push(ticket)
        }
      }

    })
    return Object.keys(ticketsGroupByMonths).map((key) => {
      let aGroupMonth = ticketsGroupByMonths[key]
      let monthName = aGroupMonth.monthName
      let year = key.split('-')[0]
      return (
        <div className="historyTickets__group" key={key}>
          <div className="historyTickets__title">{monthName} {year}</div>
          <div className="historyTickets__lists">
            {this.renderHistoryLists(aGroupMonth)}
          </div>
        </div>
      )
    })
  }
  componentDidMount() {
    if (this.props.dataTickets.length) {
      this.setState({
        isEmpty: false
      })
    }
  }
  componentWillMount() {
    // this.state.dataMyTicket = sortTickets.byTime(this.state.dataMyTicket)
    // this.state.dataMyTicket = sortTickets.byName(this.state.dataMyTicket)
  }
  render () {
    const {error, isEmpty} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if(isEmpty){
      return <section className="empty"><img src="../Home/static/icon-ticket-empty.svg"/><h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5></section>
    }
    return (
      <div className="historyTickets">
        {this.renderHistoryGroupByMonth()}
      </div>
    )
  }
}
export default HistoryTickets