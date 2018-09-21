import { PureComponent } from 'react'
import HistoryTickets from '../components/HistoryTickets'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import loading from '../static/loading.svg'
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
    Router.push('/MyTickets')
  }
  goToHistoryDetail (ticketIndex) {
    Router.push({
      pathname: '/HistoryTicketDetail'
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
    return (
      <Layout title="History Tickets">
        <div className="globalContent isHistoryTickets">
          <GlobalHeader handleBackButton={this.props.handleBackButton} titleMsg="ประวัติการใช้งาน"></GlobalHeader>
          <div className="globalBody">
            <div className="globalBodyInner">
              <HistoryTickets dataTickets={dataTickets} serverTime={serverTime} goToHistoryDetail={this.goToHistoryDetail.bind(this)} handleBackButton={this.handleBackButton.bind(this)} ></HistoryTickets>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
export default HistoryTicketsPage