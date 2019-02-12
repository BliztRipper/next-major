import { PureComponent } from 'react'
import Layout from '../components/Layout'
import GlobalHeader from '../components/GlobalHeader'
import Ticket from '../components/Ticket'
import '../styles/style.scss'

class HistoryTicketsPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      error: null,
      dataTicket: ''
    }

  }
  componentDidMount() {
    let ticketIndex = this.props.url.query.ticketIndex
    this.state.dataTicket = JSON.parse(sessionStorage.getItem('dataMyTicketsExpired'))
    this.setState({
      isLoading: false,
      dataTicket: this.state.dataTicket[ticketIndex]
    })
  }
  render () {
    const {isLoading, dataTicket} = this.state;
    if (isLoading) {
      return <img src="../Home/static/loading.svg" className="loading"/>
    }
    let movieNameEN = dataTicket.BookingMovie
    return (
      <Layout title={movieNameEN}>
        <div className="globalContent">
          <GlobalHeader>{movieNameEN}</GlobalHeader>
          <div className="globalBody">
            <div className="globalBodyInner">
              <Ticket dataTicket={dataTicket} key={dataTicket.VistaBookingId} hideButton={true} expired={true}></Ticket>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
export default HistoryTicketsPage