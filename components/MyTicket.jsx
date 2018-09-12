import { PureComponent, Fragment } from 'react'
import Ticket from './Ticket'
import empty from '../static/emptyTicket.png'
import sortTickets from '../scripts/sortTickets'
import Router from 'next/router'
import Slider from 'react-slick'

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
      isEmpty: this.props.dataMyTickets? false : this.props.dataMyTickets,
      error: null,
      dataMyTickets: this.props.dataMyTickets,
      dataMyTicketsExpired: this.props.dataMyTicketsExpired,
      sliderCurrentIndex: 0
    }
    this.refTicket = React.createRef()
    this.refSlider = React.createRef()
  }
  goToHistoryLists () {
    Router.push('/HistoryTickets')
  }
  renderMyTickets () {
    return this.state.dataMyTickets.map((ticket, ticketIndex) => {
      return (
        <Ticket ref={this.refTicket} dataTicket={ticket} key={ticket.VistaBookingId + ticketIndex} expired={false} hideButton={true}></Ticket>
      )
    })
  }
  slideHandleBeforeChange (prevIndex, newIndex) {
    this.setState({
      sliderCurrentIndex: newIndex
    })
  }
  componentWillMount() {
    if (this.state.dataMyTickets) {
      this.state.dataMyTickets = sortTickets.byTime(this.state.dataMyTickets)
    }
  }
  render () {
    const {isEmpty, dataMyTicketsExpired, dataMyTickets, sliderCurrentIndex} = this.state;
    let sliderSettings = {
      dots: false,
      infinite: false,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1
    }
    if (isEmpty) {
      return (
        <section className="empty">
          <img src={empty}/>
          <h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5>
          <ButtonHistory goToHistoryLists={this.goToHistoryLists.bind(this)} hideButton={dataMyTicketsExpired}></ButtonHistory>
        </section>
      )
    }
    return (
      <Fragment>
          <Slider
            {...sliderSettings}
            beforeChange={this.slideHandleBeforeChange.bind(this)}
          >
            {this.renderMyTickets()}
          </Slider>
          <div className="myTicketFeature">
            <div className="myTicketFeatureCounter">
              <span className="isHL1">{sliderCurrentIndex + 1}</span> / {dataMyTickets.length}
            </div>
            <div className="myTicketFeatureBtn">
              <ButtonHistory goToHistoryLists={this.goToHistoryLists.bind(this)} hideButton={dataMyTicketsExpired}></ButtonHistory>
            </div>
          </div>
      </Fragment>
    )
  }
}
export default MyTicket;