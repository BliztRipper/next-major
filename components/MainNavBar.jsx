import React, { PureComponent } from 'react';
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs';
import HighlightCarousel from '../components/HighlightCarousel'
import MainCinemaListing from '../components/MainCinemaListing'
import utilities from '../scripts/utilities'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'
// assets img
import IconGlobalNavLocation from '../static/icon-global-nav-location.svg'
import IconGlobalNavMovie from '../static/icon-global-nav-movie.svg'

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
      btnNavNumber: '',
      currentTabsIndex: 0,
      bg:'',
      highlightFetching: true,
    }

  }
  getTickets () {
    axios.get(`https://api-cinema.truemoney.net/MyTickets/${this.props.accid}`)
    .then(response => {
      this.state.dataMyTicketServerTime = response.data.server_time
      let expired = false
      if (response.data.data) {
        this.state.dataMyTickets = []
        this.state.dataMyTicketsExpired = []
        response.data.data.forEach((ticket) => {
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
    .catch(error=>{
      console.error('error', error);
      this.setState({error: true})
    })
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
    let instantbtnNavNumber = sessionStorage.getItem('btnNavNumber')
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

    switch (instantbtnNavNumber) {
      case '1':
        instantTabsIndex = 0
        break;
      case '2':
        instantTabsIndex = 1
        this.setState({
          highlightFetching: false
        })
        break;
    }

    this.setState({
      previousRoute: instantPrevRoute,
      btnNavNumber: instantbtnNavNumber,
      currentTabsIndex: instantTabsIndex
    })
    sessionStorage.removeItem('previousRoute')
    sessionStorage.removeItem('btnNavNumber')
  }

  renderFloatButtonBadge () {
    if (this.state.dataMyTicketsTotal) return <div className="indexTab__floatButton-badge">{this.state.dataMyTicketsTotal}</div>
    return false
  }

  renderFloatButton () {
    if (this.state.dataMyTicketsDone) {
      return (
        <div className="indexTab__floatButton" onClick={this.goToMyTickets} key="buttonLinkToMyTicket">
          <div className="indexTab__floatButtonInner">
            <img className="indexTab__floatButton-icon" src="../static/icon-ticket.svg" alt=""/>
            { this.renderFloatButtonBadge() }
          </div>
        </div>
      )
    }
  }

  goToMyTickets () {
    Router.push('/MyTickets')
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
        {/* {(() => {
          if (currentTabsIndex === 0) {
            return (
              <div className="background-blur__wrapper" key="bgBlurEffect">
                <div className="background-blur" style={bgblur}></div>
              </div>
            )
          }
          })()} */}
        <Tabs
          onSelect={this.onSelectTabs.bind(this)}
          selectedIndex={currentTabsIndex}
          key="indexTabsContainer"
          >
          <TabPanel>
            <div className="allmovie-btn-wrap" key="ButtonSeeAllMovies">
              <Link prefetch href={dataToAllMovies}>
                <a className="allmovie-btn"><img className="allmovie-btn-icon" src="../static/all-movie-icon.svg" /> ดูภาพยนต์ทั้งหมด</a>
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
          <div className="react-tabs__isFooter">
            <TabList>
              <div className="react-tabs__tabs-container">
                <Tab>
                  <div className="tab-menu-icon">
                    <svg width='25' height='22' viewBox='0 0 25 22' xmlns='http://www.w3.org/2000/svg'>
                      <g id='iconGlobalNavMovie' fill='none' fillRule='evenodd'>
                        <g transform='translate(-12 -403)' stroke='#989FAE' strokeWidth='1.5'>
                          <g id='icon-movie' transform='translate(13 404)'>
                            <rect id='Rectangle-3' x='5' width='13' height='10' />
                            <rect id='Rectangle-3-Copy' x='5' y='10' width='13' height='10' />
                            <polygon id='Rectangle-3-Copy-3' points='0 5 5 5 5 10 0 10' />
                            <path d='M1.5,0 L5,0 L5,5 L0,5 L0,1.5 C-1.01453063e-16,0.671572875 0.671572875,1.52179594e-16 1.5,0 Z'
                              id='Rectangle-3-Copy-6' />
                            <path d='M0,15 L5,15 L5,20 L1.5,20 C0.671572875,20 1.01453063e-16,19.3284271 0,18.5 L0,15 Z'
                              id='Rectangle-3-Copy-2' />
                            <polygon id='Rectangle-3-Copy-8' points='0 10 5 10 5 15 0 15' />
                            <path d='M18,0 L21.5,0 C22.3284271,-1.52179594e-16 23,0.671572875 23,1.5 L23,5 L18,5 L18,0 Z'
                              id='Rectangle-3-Copy-7' />
                            <polygon id='Rectangle-3-Copy-9' points='18 5 23 5 23 10 18 10' />
                            <path d='M18,15 L23,15 L23,18.5 C23,19.3284271 22.3284271,20 21.5,20 L18,20 L18,15 Z'
                              id='Rectangle-3-Copy-4' />
                            <polygon id='Rectangle-3-Copy-9' points='18 10 23 10 23 15 18 15' />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <span className="tab-menu-title">ภาพยนต์</span>
                </Tab>
                <Tab disabled={highlightFetching}>
                  <div className="tab-menu-icon">
                    <svg width='17' height='22' viewBox='0 0 17 22' xmlns='http://www.w3.org/2000/svg'>
                      <g id='iconGlobalNavLocation' fill='none' fillRule='evenodd'>
                        <g transform='translate(-44 -403)' fillRule='nonzero'
                          stroke='#989FAE' strokeWidth='1.5'>
                          <g id='icon-location' transform='translate(45 404)'>
                            <g id='Group'>
                              <path d='M7.38431792,0.125470669 C3.61576946,0.125470669 0.483800139,3.1116726 0.229168487,6.90088681 C0.127315826,8.58219378 0.662042296,10.313689 1.7569584,11.7440546 L7.1042231,19.2722948 C7.1806126,19.3726713 7.28246526,19.4228596 7.40978108,19.4228596 C7.53709691,19.4228596 7.66441273,19.3726713 7.71533906,19.2722948 L13.0371406,11.7440546 C14.1320567,10.2885949 14.6667832,8.58219378 14.5649305,6.87579268 C14.2848357,3.1116726 11.1528664,0.125470669 7.38431792,0.125470669 Z'
                                id='Shape' />
                              <path d='M7.38431792,4.46675583 C5.80560167,4.46675583 4.50698025,5.74655665 4.50698025,7.32748708 C4.50698025,8.90841752 5.80560167,10.1882183 7.38431792,10.1882183 C8.96303416,10.1882183 10.2616556,8.90841752 10.2616556,7.32748708 C10.2616556,5.74655665 8.96303416,4.46675583 7.38431792,4.46675583 Z'
                                id='Shape' />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <span className="tab-menu-title">โรงภาพยนต์</span>
                </Tab>
                <li className="isBlank">ตั้วหนัง</li>
              </div>
            </TabList>
          </div>
        </Tabs>
        {this.renderFloatButton()}
      </div>
    )
  }
}

export default MainNavBar;
