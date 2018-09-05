import {PureComponent} from 'react'
import '../styles/style.scss'
import Layout from '../components/Layout'
import Ticket from '../components/Ticket'
import GlobalHeader from '../components/GlobalHeader'

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
    let movieNameEN = this.props.dataTicket.BookingMovie
    return (
      <Layout title={movieNameEN}>
        <GlobalHeader handleBackButton={this.props.handleBackButton} titleMsg={movieNameEN}></GlobalHeader>
        {this.renderTickets()}
      </Layout>
    )
  } 
}
export default HistoryTicketDetail