import { PureComponent } from 'react'
import Ticket from './Ticket'
import empty from '../static/emptyTicket.png'
import sortTickets from '../scripts/sortTickets'
import Router from 'next/router'
import Swiper from 'swiper'

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
      isEmpty: this.props.dataMyTickets? false : true,
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
        <div className="swiper-slide" key={ticket.VistaBookingId + ticketIndex}>
          <Ticket ref={this.refTicket} dataTicket={ticket} expired={false} hideButton={true}></Ticket>
        </div>
      )
    })
  }

  iniSlider () {
    const sliderSetting = {
      watchSlidesProgress: true,
      freeMode: true,
      touchRatio: 1.5,
      freeModeMomentumRatio: 0.2,
      longSwipesMs: 50,
      freeModeSticky: true
    }
    let swiper = new Swiper(this.refs.slider, sliderSetting)
    swiper.on('slideChange', () => { this.sliderChange(swiper.activeIndex) })
    return swiper
  }

  sliderChange (activeIndex) {
    this.setState({
      sliderCurrentIndex: activeIndex
    })
  }
  componentWillMount() {
    if (this.state.dataMyTickets) {
      this.state.dataMyTickets = sortTickets.byTime(this.state.dataMyTickets)
    }
  }
  componentDidMount() {
    this.iniSlider()
  }
  render () {
    const {isEmpty, dataMyTicketsExpired, dataMyTickets, sliderCurrentIndex} = this.state;
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
      <div className="myticketItems">
        <div className="swiper-container" ref="slider" key="slider">
          <div className="swiper-wrapper">
            {this.renderMyTickets()}
          </div>
        </div>
        <div className="myTicketFeature" key="sliderFeature">
          <div className="myTicketFeatureCounter" key="counter">
            <span className="isHL1">{sliderCurrentIndex + 1}</span> / {dataMyTickets.length}
          </div>
          <div className="myTicketFeatureBtn" key="button">
            <ButtonHistory goToHistoryLists={this.goToHistoryLists.bind(this)} hideButton={dataMyTicketsExpired}></ButtonHistory>
          </div>
        </div>
      </div>
    )
  }
}
export default MyTicket;