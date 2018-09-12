import {PureComponent} from 'react'
import '../styles/style.scss'
import Ticket from '../components/Ticket'

class HistoryTicketDetail extends PureComponent {
  renderTickets () {
    if (this.props.dataTicket) {
      let aTicket = this.props.dataTicket
      return (
        <Ticket ref={this.refTicket} dataTicket={aTicket} key={aTicket.VistaBookingId} hideButton={true} expired={true}></Ticket>
      )
    }
  }
  render () {
    return this.renderTickets()
  }
}
export default HistoryTicketDetail