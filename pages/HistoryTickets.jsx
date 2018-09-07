import { PureComponent } from 'react'
import HistoryTickets from '../components/HistoryTickets'
import loading from '../static/loading.gif'
import Router from 'next/router'

class HistoryTicketsPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      error: null,
      dataTickets: '',
      serverTime: ''
    }
    
  }
  handleBackButton () {
    Router.push('/')
  }
  goToHistoryDetail (ticketIndex) {
    Router.push({
      pathname: '/HistoryTicketDetail',
      query: {
        ticketIndex: ticketIndex
      }
    })
  }
  componentDidMount() {
    this.setState({
      isLoading: false,
      dataTickets: JSON.parse(sessionStorage.getItem('dataMyTicketsExpired')),
      serverTime: sessionStorage.getItem('dataMyTicketServerTime')
    })
  }
  render () {
    const {isLoading, dataTickets, serverTime} = this.state;
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    return <HistoryTickets dataTickets={dataTickets} serverTime={serverTime} goToHistoryDetail={this.goToHistoryDetail.bind(this)} handleBackButton={this.handleBackButton.bind(this)} ></HistoryTickets>
  }
}
export default HistoryTicketsPage