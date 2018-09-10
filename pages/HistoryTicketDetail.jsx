import { PureComponent } from 'react'
import HistoryTicketDetail from '../components/HistoryTicketDetail'
import loading from '../static/loading.gif'
import Router from 'next/router'

class HistoryTicketsPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      error: null,
      dataTicket: ''
    }
    
  }
  handleBackButton () {
    Router.push('/HistoryTickets')
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
      return <img src={loading} className="loading"/>
    }
    return <HistoryTicketDetail dataTicket={dataTicket} handleBackButton={this.handleBackButton} ></HistoryTicketDetail>
  }
}
export default HistoryTicketsPage