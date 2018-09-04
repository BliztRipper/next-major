import {PureComponent} from 'react'
import '../styles/style.scss'
import GlobalHeader from '../components/GlobalHeader'
import Layout from '../components/Layout'
import Ticket from '../components/Ticket'
import loading from '../static/loading.gif'
import empty from '../static/emptyTicket.png'
import Router from 'next/router'

class HistoryTicketDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isEmpty:true,
      error: null,
      dataMyTicket: []
    }
  }
  handleBackButton () {
    Router.push({
      pathname: '/HistoryTickets'
    })
  }
  renderTickets () {
    if (this.state.dataMyTicket) {
      return this.state.dataMyTicket.map((aTicket) => {
        return (
          <Ticket ref={this.refTicket} dataTicket={aTicket} key={aTicket.VistaBookingId} hideButton={true} expired={true}></Ticket>
        )
      })
    }
  }
  componentWillMount() {
    // dummy api
    this.state.isLoading = false
    this.state.isEmpty = false
    this.state.dataMyTicket.push({
      BookingPoster: 'https://www.majorcineplex.com/uploads/movie/2418/thumb_2418.jpg',
      BookingMovie: 'Destination Wedding',
      BookingMovieTH: 'ไปงานแต่งเขา แต่เรารักกัน',
      BookingGenre: 'Comedy/Drama/Romance',
      BookingDuration: 86,
      BookingCinema: 'Dummy Cinema',
      BookingTime: '00:01',
      BookingScreenName: 'Dummy Screen Name',
      BookingSeat: 'Dummy Seats',
      BookingAttributesNames: 'Dummy AttributesNames',
      BookingPriceDisplay: 100,
      VistaBookingNumber: 'VistaBookingNumber',
      VistaBookingId: 'VistaBookingId'
    })
    
  }
  render () {
    const {isLoading, error, isEmpty} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5></section>
    }   
    return (
      <Layout>
        {
          <div className="LOREM's IPSUM DOLOR.">
            <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="LOREM's IPSUM DOLOR."></GlobalHeader>
            {this.renderTickets()}
          </div>
        }
      </Layout>
    )
  } 
}
export default HistoryTicketDetail