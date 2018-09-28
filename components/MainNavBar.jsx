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
      isLoading: true,
      dataMyTicketsDone: false,
      dataMyTicketServerTime: '',
      dataMyTickets: '',
      dataMyTicketsTotal: '',
      dataMyTicketsExpired: '',
      previousRoute: '',
      currentTabsIndex: 0,
      bg:'',
      highlightFetching: true,
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
          if (this.state.dataMyTickets.length === 0) this.state.dataMyTickets = null
          if (this.state.dataMyTicketsExpired.length === 0) this.state.dataMyTicketsExpired = null
        } else {
          this.state.dataMyTicketsExpired = null
          this.state.dataMyTickets = null
        }
        this.setState({
          dataMyTicketsExpired: JSON.stringify(this.state.dataMyTicketsExpired),
          dataMyTickets: JSON.stringify(this.state.dataMyTickets),
          dataMyTicketsTotal: this.state.dataMyTicketsTotal,
          dataMyTicketServerTime: this.state.dataMyTicketServerTime,
          dataMyTicketsDone: true
        }, () => {
          sessionStorage.setItem('dataMyTicketsExpired', this.state.dataMyTicketsExpired)
          sessionStorage.setItem('dataMyTickets', this.state.dataMyTickets)
          sessionStorage.setItem('dataMyTicketServerTime', this.state.dataMyTicketServerTime)
        })
      })
    } catch (err) {
      error => {
        console.error('error', error);
        this.setState({error: true})
      }
    }
  }
  ticketHasExpired (ticket) {

    let serverDate = new Date(this.state.dataMyTicketServerTime)
    let expiredMaxHours = 3
    let offsetTime = expiredMaxHours * 3600 * 1000
    let serverResulTime = serverDate.getTime()

    let ticketBookedResultTime = ticket.BookingFullDate ? utilities.getStringDateTimeFromTicket(ticket.BookingFullDate, ticket.BookingTime).date.getTime() : false

    return serverResulTime - ticketBookedResultTime > offsetTime
  }

  onSelectTabs (index) {
    this.setState({currentTabsIndex: index})
    if (index !== 0) {
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
        this.setState({
          highlightFetching: false
        })
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
      <a className="indexTab__floatButton">
        <div className="indexTab__floatButtonInner">
          <img className="indexTab__floatButton-icon" src="../static/icon-ticket.svg" alt=""/>
          { this.renderFloatButtonBadge() }
        </div>
      </a>
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

  highlightFetched (status) {
    this.setState({
      highlightFetching: !status
    })
  }

  render() {
    const {dataMyTicketsDone, bg, currentTabsIndex, highlightFetching} = this.state
    resetIdCounter()
    let dataToAllMovies = ''
    let dataToMyTicket = {
      pathname: '/MyTickets'
    }
    let bgblur = {
      backgroundImage: `url(${bg})`,
      backgroundSize:'cover',
      filter: 'blur(16px)',
    }
    let tabsClassName = 'indexTab'
    if (!highlightFetching) {
      dataToAllMovies = {
        pathname: '/AllMovie'
      }
    } else {
      tabsClassName = tabsClassName + ' isFetching'
    }

    return (
      <div className={tabsClassName} >
        {(() => {
          if (currentTabsIndex === 0) {
            return (
              <div className="background-blur__wrapper" key="bgBlurEffect">
                <div className="background-blur" style={bgblur}></div>
              </div>
            )
          }
          })()}
        <Tabs
          onSelect={this.onSelectTabs.bind(this)}
          selectedIndex={currentTabsIndex}
          key="indexTabsContainer"
          >
          <TabPanel>
            <div className="allmovie-btn-wrap" key="ButtonSeeAllMovies">
              <Link prefetch href={dataToAllMovies}>
                <a className="allmovie-btn"><div className="sprite-table"></div> ดูภาพยนต์ทั้งหมด</a>
              </Link>
            </div>
            <HighlightCarousel
              key="HighlightCarousel"
              bg={this.getBG.bind(this)}
              accid={this.props.accid}
              highlightFetched={this.highlightFetched.bind(this)}/>
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
              <Tab disabled={highlightFetching}>
                <div className="sprite-tab-menu2"></div>
                <span className="tab-menu-title">โรงภาพยนต์</span>
              </Tab>
              <li className="isBlank">ตั้วหนัง</li>
            </div>
          </TabList>
        </Tabs>
        {(() => {
          if (dataMyTicketsDone) {
            return (
              <Link prefetch href={dataToMyTicket} key="buttonLinkToMyTicket">
                { this.renderFloatButton() }
              </Link>
            )
          }
        })()}
      </div>
    )
  }
}

export default MainNavBar;
