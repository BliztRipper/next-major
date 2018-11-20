import { PureComponent } from 'react'
import HistoryTickets from '../components/HistoryTickets'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import loading from '../static/loading.svg'
import Router from 'next/router'
import Page from '../components/Page'

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
    return (
      <Page>
        <Layout title="History Tickets">
          <div className="globalContent isHistoryTickets">
            <GlobalHeader>ประวัติการใช้งาน</GlobalHeader>
            <div className="globalBody">
              <div className="globalBodyInner">
                <HistoryTickets dataTickets={dataTickets} serverTime={serverTime} goToHistoryDetail={this.goToHistoryDetail.bind(this)} ></HistoryTickets>
              </div>
            </div>
          </div>
        </Layout>
      </Page>
    )
  }
}
export default HistoryTicketsPage