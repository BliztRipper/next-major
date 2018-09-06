import { PureComponent } from 'react'
import Ticket from './Ticket'
import loading from '../static/loading.gif'
import empty from '../static/emptyTicket.png'
import sortTickets from '../scripts/sortTickets'
import utilities from '../scripts/utilities'
import HistoryTickets from '../components/HistoryTickets'
import HistoryTicketDetail from '../components/HistoryTicketDetail'

class ButtonHistory extends PureComponent {
  render () {
    if (!this.props.hideButton) return false
    return (
      <div className="btnTheme" onClick={this.props.goToHistoryLists}><span>ดูประวัติการใช้งาน</span></div>
    )
  }
}
class MyTicket extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      serverTime: '',
      isLoading: true,
      isEmpty:true,
      error: null,
      userPhoneNumber: this.props.accid,
      dataMyTicket: [],
      dataTicketsActive: [],
      dataHistoryLists: [],
      dataHistoryDetail: '',
      historyListsShow: false,
      historyDetailShow: false
    }
    this.refTicket = React.createRef()
  }
  handleBackButton (from) {
    if (from === 'HistoryTickets') {
      this.goToMyTickets()
    } else if (from === 'HistoryTicketDetail') {
      this.goToHistoryLists()
    }
  }
  goToMyTickets () {
    this.setState({
      historyListsShow: false,
      historyDetailShow: false
    })
  }
  goToHistoryLists () {
    this.setState({
      historyListsShow: true,
      historyDetailShow: false,
      isEmpty: false
    })
  }
  goToHistoryDetail (ticket) {
    this.setState({
      historyListsShow: false,
      historyDetailShow: true,
      dataHistoryDetail: ticket
    })
  }
  getTickets () {
    try{
      fetch(`https://api-cinema.truemoney.net/MyTickets/${this.state.userPhoneNumber}`)
      .then(response => response.json())
      .then(data => {
        console.log(data, 'data RESPONSE MyTickets')
        this.state.serverTime = data.server_time

        let expired = false
        if (data.data) {
          data.data.forEach((ticket) => {
            expired = this.hasExpired(ticket)
            if (!expired) {
              this.state.dataMyTicket.push(ticket) 
            } else {
              this.state.dataHistoryLists.push(ticket)
            }
          })
          if (this.state.dataMyTicket.length === 0){
            this.setState({isEmpty:true})
          } else {
            this.setState({ 
              dataMyTicket: this.state.dataMyTicket,
              isEmpty: false,
              isLoading: false 
            })
          }
        } else {

          this.setState({ 
            dataMyTicket: false,
            isLoading: false,
            isEmpty: true
          })
        }
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }    
  }
  hasExpired (ticket) {
    let serverDate = new Date(this.state.serverTime)
    let expiredMaxHours = 3
    let offsetTime = expiredMaxHours * 3600 * 1000
    
    let serverResulTime = serverDate.getTime()
    let ticketBookedResultTime = utilities.getStringDateTimeFromTicket(ticket.BookingDate, ticket.BookingTime).date.getTime();

    return serverResulTime - ticketBookedResultTime > offsetTime
  }
  renderMyTickets () {
    return this.state.dataMyTicket.map((ticket, ticketIndex) => {
      return (
        <Ticket ref={this.refTicket} dataTicket={ticket} key={ticket.VistaBookingId + ticketIndex} expired={false} hideButton={true}></Ticket>
      )
    })
  }
  renderHistoryLists () {
    return <HistoryTickets dataTickets={this.state.dataHistoryLists} serverTime={this.state.serverTime} handleBackButton={this.handleBackButton.bind(this, 'HistoryTickets')} goToHistoryDetail={this.goToHistoryDetail.bind(this)}></HistoryTickets>
  }
  renderHistoryDetail () {
    return <HistoryTicketDetail dataTicket={this.state.dataHistoryDetail} handleBackButton={this.handleBackButton.bind(this, 'HistoryTicketDetail')}></HistoryTicketDetail>
  }
  componentWillMount() {
    this.getTickets()
    this.state.dataMyTicket = sortTickets.byTime(this.state.dataMyTicket)
    // this.state.dataMyTicket = sortTickets.byName(this.state.dataMyTicket)
  }
  render () {
    const {isLoading, error, isEmpty, historyListsShow, historyDetailShow, dataMyTicket} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return (
        <section className="empty">
          <img src={empty}/>
          <h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5>
          <ButtonHistory goToHistoryLists={this.goToHistoryLists.bind(this)} hideButton={dataMyTicket}></ButtonHistory>
        </section>
      )
    }   
    if (historyListsShow && !historyDetailShow) {
      return this.renderHistoryLists()
    } 
    if (!historyListsShow && historyDetailShow) {
      return this.renderHistoryDetail()
    }
    return (
      <div className="myTickets">
        <header className="cashier-header">ตั๋วของฉัน</header>
        {this.renderMyTickets()}
        <ButtonHistory goToHistoryLists={this.goToHistoryLists.bind(this)} hideButton={dataMyTicket}></ButtonHistory>
      </div>
    )
  }
}
export default MyTicket;