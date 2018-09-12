import React, { PureComponent, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs';
import HighlightCarousel from '../components/HighlightCarousel'
import MainCinemaListing from '../components/MainCinemaListing'
import utilities from '../scripts/utilities'
import Link from 'next/link'
import Router from 'next/router'

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
    this.bounceOnScrollStyles = {
      disable: 'position: fixed; top: 0; left: 0; margin: 0; padding: 8px; width: 100vw; height: 100vh; overflow-x: hidden; overflow-y: scroll; -webkit-overflow-scrolling: touch;',
      enable: 'position: ; top: ; left: ; margin: ; padding: ; width: ; height: ; overflow-x: ; overflow-y: ; -webkit-overflow-scrolling: ;'
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
  setStyleBounceOnScroll (styles) {
    // let documents = [document.documentElement, document.body]
    // documents.forEach(element => element.style.cssText = styles);
  }

  onSelectTabs (index) {
    this.state.currentTabsIndex = index
    if (this.state.currentTabsIndex !== 0) {
      this.setStyleBounceOnScroll(this.bounceOnScrollStyles.enable)
    } else {
      this.setStyleBounceOnScroll(this.bounceOnScrollStyles.disable)
    }
  }
  componentDidMount () {
    utilities.removeBookingInfoInSessionStorage()
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
  goToMyTickets () {
    Router.push({
      pathname: '/MyTickets',
      query: {
        accid: this.props.accid
      }
    })
  }
  renderFloatButtonBadge () {
    if (this.state.dataMyTicketsTotal) return <div className="indexTab__floatButton-badge">{this.state.dataMyTicketsTotal}</div>
    return false
  }
  renderFloatButton () {
    return (
      <div className="indexTab__floatButton" onClick={this.goToMyTickets.bind(this)}>
        <div className="indexTab__floatButtonInner">
          <img className="indexTab__floatButton-icon" src="../static/icon-ticket.svg" alt=""/>
          { this.renderFloatButtonBadge() }
        </div>
      </div>
    )
  }
  componentDidMount () {
    this.getTickets()
    this.getPreviousRoute()
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
      pathname: '/AllMovie',
      query: {
        accid: this.props.accid
      }
    }
    let bgblur = {
      backgroundImage: `url(${bg})`,
      backgroundSize:'cover',
      filter: 'blur(16px)',
      // opacity: '0.75',
    }
    if (dataMyTicketsDone) {
      if (this.state.currentTabsIndex === 0) {
        this.setStyleBounceOnScroll(this.bounceOnScrollStyles.disable)
      }
      return (
        <div className="indexTab">
        <div className="background-blur__wrapper">
          <div className="background-blur" style={bgblur}></div>
        </div>
          <Tabs
          onSelect={this.onSelectTabs.bind(this)}
          defaultIndex={currentTabsIndex}>
            <TabPanel>
              <Link prefetch href={dataToAllMovies}>
                <div>
                  <div className="sprite-table"></div>
                  <a className="allmovie-btn">ดูภาพยนต์ทั้งหมด</a>
                </div>
              </Link>
              <HighlightCarousel bg={this.getBG.bind(this)} accid={this.props.accid}/>
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
              { this.renderFloatButton() }
            </TabList>
          </Tabs>
        </div>
      )
    }
    return false
  }
}

export default MainNavBar;
