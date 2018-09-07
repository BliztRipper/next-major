import { PureComponent } from 'react'
import Ticket from './Ticket'
import empty from '../static/emptyTicket.png'
import sortTickets from '../scripts/sortTickets'
import Router from 'next/router'

class ButtonHistory extends PureComponent {
  render () {
    if (!this.props.hideButton) return false
    return (
      <div className="btnTheme" onClick={this.props.goToHistoryLists}><span>ดูประวัติการใช้งาน</span></div>
    )
  }
}
class MyTicket extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isEmpty: this.props.dataMyTickets? false : this.props.dataMyTickets,
      error: null,
      dataMyTickets: this.props.dataMyTickets,
      dataMyTicketsExpired: this.props.dataMyTicketsExpired
    }
    this.refTicket = React.createRef()
  }
  goToHistoryLists () {
    Router.push('/HistoryTickets')
  }
  renderMyTickets () {
    return this.state.dataMyTickets.map((ticket, ticketIndex) => {
      return (
        <Ticket ref={this.refTicket} dataTicket={ticket} key={ticket.VistaBookingId + ticketIndex} expired={false} hideButton={true}></Ticket>
      )
    })
  }
  componentWillMount() {
    if (this.state.dataMyTickets) {
      this.state.dataMyTickets = sortTickets.byTime(this.state.dataMyTickets)
      // this.state.dataMyTickets = sortTickets.byName(this.state.dataMyTickets)
    }
    
  }
  render () {
    const {isEmpty, dataMyTicketsExpired} = this.state;
    if (isEmpty) {
      return (
        <section className="empty">
          <img src={empty}/>
          <h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5>
          <ButtonHistory goToHistoryLists={this.goToHistoryLists.bind(this)} hideButton={dataMyTicketsExpired}></ButtonHistory>
        </section>
      )
    }   
    return (
      <div className="myTickets">
        {this.renderMyTickets()}
        <ButtonHistory goToHistoryLists={this.goToHistoryLists.bind(this)} hideButton={dataMyTicketsExpired}></ButtonHistory>
      </div>
    )
  }
}
export default MyTicket;