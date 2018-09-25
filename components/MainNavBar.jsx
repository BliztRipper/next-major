import React, { PureComponent } from 'react';
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs';
import HighlightCarousel from '../components/HighlightCarousel'
import MainCinemaListing from '../components/MainCinemaListing'
import utilities from '../scripts/utilities'
import Router from 'next/router'
import Link from 'next/link'

class MainNavBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataMyTicketsDone: false,
      dataMyTicketServerTime: '',
      dataMyTickets: '',
      dataMyTicketsTotal: '',
      dataMyTicketsExpired: '',
      previousRoute: '',
      currentTabsIndex: 0,
      bg:''
    }

  }
  getTickets () {
    try{
      fetch(`https://api-cinema.truemoney.net/MyTickets/${this.props.accid}`)
      .then(response => response.json())
      .then(data => {
        this.state.dataMyTicketServerTime = data.server_time
        let expired = false
        if (data.data) {
          this.state.dataMyTickets = []
          this.state.dataMyTicketsExpired = []
          data.data.forEach((ticket) => {
            expired = this.ticketHasExpired(ticket)
            if (!expired) {
              this.state.dataMyTickets.push(ticket)
            } else {
              this.state.dataMyTicketsExpired.push(ticket)
            }
          })
          this.state.dataMyTicketsTotal = this.state.dataMyTickets.length > 0 ? this.state.dataMyTickets.length : false
          this.state.dataMyTicketsExpired = JSON.stringify(this.state.dataMyTicketsExpired)
          this.state.dataMyTickets = JSON.stringify(this.state.dataMyTickets)
          if (this.state.dataMyTickets.length === 0) this.state.dataMyTickets = null
          if (this.state.dataMyTicketsExpired.length === 0) this.state.dataMyTicketsExpired = null
        } else {
          this.state.dataMyTicketsExpired = null
          this.state.dataMyTickets = null
        }
        sessionStorage.setItem('dataMyTicketsExpired', this.state.dataMyTicketsExpired)
        sessionStorage.setItem('dataMyTickets', this.state.dataMyTickets)
        sessionStorage.setItem('dataMyTicketServerTime', this.state.dataMyTicketServerTime)
        this.setState({
          dataMyTicketsExpired: this.state.dataMyTicketsExpired,
          dataMyTickets: this.state.dataMyTickets,
          dataMyTicketsTotal: this.state.dataMyTicketsTotal,
          dataMyTicketServerTime: this.state.dataMyTicketServerTime,
          dataMyTicketsDone: true
        })
      })
    } catch (err) {
      error => {
        console.error('error', error);
        this.setState({ error})
      }
    }
  }
  ticketHasExpired (ticket) {
    let serverDate = new Date(this.state.dataMyTicketServerTime)
    let expiredMaxHours = 3
    let offsetTime = expiredMaxHours * 3600 * 1000
    let serverResulTime = serverDate.getTime()
    let ticketBookedResultTime = utilities.getStringDateTimeFromTicket(ticket.BookingDate, ticket.BookingTime).date.getTime();
    return serverResulTime - ticketBookedResultTime > offsetTime
  }

  onSelectTabs (index) {
    this.state.currentTabsIndex = index
    this.setState({currentTabsIndex: index})
    if (this.state.currentTabsIndex !== 0) {
      utilities.bounceOnScroll().enable()
    } else {
      utilities.bounceOnScroll().disable()
    }

  }
  getPreviousRoute () {
    let instantPrevRoute = sessionStorage.getItem('previousRoute')
    let instantTabsIndex = 0
    switch (instantPrevRoute) {
      case '/SelectMovieByCinema':
        instantTabsIndex = 1
        break;
      default:
        instantTabsIndex = 0
        break;
    }
    this.setState({
      previousRoute: instantPrevRoute,
      currentTabsIndex: instantTabsIndex
    })
    sessionStorage.removeItem('previousRoute')
  }

  renderFloatButtonBadge () {
    if (this.state.dataMyTicketsTotal) return <div className="indexTab__floatButton-badge">{this.state.dataMyTicketsTotal}</div>
    return false
  }
  renderFloatButton () {
    return (
      <div className="indexTab__floatButton">
        <div className="indexTab__floatButtonInner">
          <img className="indexTab__floatButton-icon" src="../static/icon-ticket.svg" alt=""/>
          { this.renderFloatButtonBadge() }
        </div>
      </div>
    )
  }
  routeChangeStart () {
    utilities.bounceOnScroll().enable()
  }
  componentWillMount() {
    Router.events.on('routeChangeStart', this.routeChangeStart.bind(this))
  }
  componentDidMount () {
    utilities.removeBookingInfoInSessionStorage()
    this.getTickets()
    this.getPreviousRoute()
    if (this.state.currentTabsIndex === 0) {
      utilities.bounceOnScroll().disable()

    }
  }

  getBG(bg){
    this.setState({
      bg:bg
    })
  }

  render() {
    const {dataMyTicketsDone, bg, currentTabsIndex} = this.state
    resetIdCounter()
    let dataToAllMovies = {
      pathname: '/AllMovie'
    }
    let dataToMyTicket = {
      pathname: '/MyTickets'
    }
    let bgblur = {
      backgroundImage: `url(${bg})`,
      backgroundSize:'cover',
      filter: 'blur(16px)',
    }
    if (dataMyTicketsDone) {
      return (
        <div className="indexTab">
         {
           (() => {
            if (currentTabsIndex === 0) {
              return (
                <div className="background-blur__wrapper" key="bgBlurEffect">
                  <div className="background-blur" style={bgblur}></div>
                </div>
              )
            }
           }) ()
         }
          <Tabs
            onSelect={this.onSelectTabs.bind(this)}
            defaultIndex={currentTabsIndex}
            key="indexTabsContainer"
            >
            <TabPanel>
              <Link prefetch href={dataToAllMovies} key="ButtonSeeAllMovies">
                <div className="allmovie-btn-wrap">
                  <div className="sprite-table"></div>
                  <a className="allmovie-btn">ดูภาพยนต์ทั้งหมด</a>
                </div>
              </Link>
              <HighlightCarousel key="HighlightCarousel" bg={this.getBG.bind(this)} accid={this.props.accid}/>
            </TabPanel>
            <TabPanel>
              <MainCinemaListing accid={this.props.accid}/>
            </TabPanel>
            <TabList>
              <div className="react-tabs__tabs-container">
                <Tab>
                  <div className="sprite-tab-menu1"></div>
                  <span className="tab-menu-title">ภาพยนต์</span>
                </Tab>
                <Tab>
                  <div className="sprite-tab-menu2"></div>
                  <span className="tab-menu-title">โรงภาพยนต์</span>
                </Tab>
                <li className="isBlank">ตั้วหนัง</li>
              </div>
            </TabList>
          </Tabs>
          <Link prefetch href={dataToMyTicket} key="buttonLinkToMyTicket">
            { this.renderFloatButton() }
          </Link>
        </div>
      )
    }
    return false
  }
}

export default MainNavBar;
