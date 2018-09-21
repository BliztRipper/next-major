import { PureComponent } from 'react';
import Layout from '../components/Layout'
import MyTicket from '../components/MyTicket'
import GlobalHeader from '../components/GlobalHeader'
import loading from '../static/loading.svg'
import Router from 'next/router'
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
  handleBackButton () {
    Router.push('/')
  }

  componentDidMount(){
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
      return <img src={loading} className="loading"/>
    }
    return (
      <Layout title='My Tickets'>
        <div className="globalContent isMyTicket" key="globalContent isMyTicket">
          {/* <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="ตั๋วของฉัน"></GlobalHeader> */}
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
