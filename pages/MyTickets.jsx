import { PureComponent } from 'react';
import Layout from '../components/Layout'
import MyTicket from '../components/MyTicket'
import GlobalHeader from '../components/GlobalHeader'
import Router from 'next/router'
import utilities from '../scripts/utilities'
import '../styles/style.scss'

class MyTickets extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataMyTickets: [],
      dataMyTicketsExpired: [],
      isLoading: true,
      error: null,
      accid: this.props.url.query.accid
    }

  }
  componentDidMount(){
    utilities.bounceOnScroll().disable()
    Router.events.on('routeChangeStart', () => {
      utilities.bounceOnScroll().enable()
    })
    this.setState({
      isLoading: false,
      dataMyTickets: JSON.parse(sessionStorage.getItem('dataMyTickets')),
      dataMyTicketsExpired: JSON.parse(sessionStorage.getItem('dataMyTicketsExpired')),
    })
  }

  render() {
    const {isLoading, error, dataMyTicketsExpired, dataMyTickets} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src="../Home/static/loading.svg" className="loading"/>
    }
    return (
      <Layout title='My Tickets'>
        <div className="globalContent isMyTicket" key="globalContent isMyTicket">
          <GlobalHeader> ตั๋วของฉัน </GlobalHeader>
          <div className="globalBody">
            <div className="globalBodyInner">
              <MyTicket dataMyTickets={dataMyTickets} dataMyTicketsExpired={dataMyTicketsExpired}></MyTicket>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default MyTickets;
