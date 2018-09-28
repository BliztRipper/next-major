import React, { PureComponent, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.svg'
import empty from '../static/emptyMovie.png'
import Router from 'next/router'
import DateFilters from '../components/DateFilters'
import MovieWithShowtimeComp from '../components/MovieWithShowtimeComp';
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
import '../styles/style.scss'

class MainSelectMovieByCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      serverTime:'',
      isEmpty:false,
      accid: '',
      schedules: [],
      dates: [],
      pickThisDay: false,
      highlightFetching: true,
      dataMyTicketsDone: false,
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

  componentDidMount() {
    sessionStorage.setItem('previousRoute', this.props.url.pathname)
    let nowShowing = sessionStorage.getItem("now_showing")
    if (!nowShowing) this.goToHome()
    this.setState({nowShowing:JSON.parse(nowShowing)})
    this.getTickets()
    try {
      fetch(`https://api-cinema.truemoney.net/Schedule`,{
        method: 'POST',
        body:JSON.stringify({cinemaId:sessionStorage.getItem('CinemaID')})
      })
      .then(response => response.json())
      .then(data => {
        this.state.schedules = data.data
        this.state.serverTime = data.server_time
        this.fillterDate()
      })
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }

  goToHome() {
    Router.push({
      pathname: '/'
    })
  }

  fillterDate() {
    let mapDates = []
    this.state.schedules.forEach(schedule => {
      schedule.Theaters.forEach(theater => {
        theater.Showtimes.forEach(showtime => {
          let strDate = showtime.substring(0, 10)
          if (!(strDate in mapDates)) {
            mapDates[strDate] = true
            this.state.dates.push(strDate)
          }
        })
      })
    })

    const stringSorter = function(a, b) {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    }
    this.state.dates.sort(stringSorter)
    this.pickThisDay(0, true)
    this.setState({
      schedules: this.state.schedules,
      serverTime: this.state.serverTime,
      dates: this.state.dates,
      isEmpty:(this.state.dates.length == 0),
      accid: JSON.parse(sessionStorage.getItem("userInfo")).accid
    })
  }

  pickThisDay(index, init){
    if (init) {
      this.setState({
        pickThisDay: this.state.dates[index],
        isLoading: false
      })
    } else {
      setTimeout(() => {
        this.setState({
          pickThisDay: this.state.dates[index]
        })
      }, 100);
    }
  }

  dateFilterSliderBeforeChange (index)  {
    this.pickThisDay(index)
  }

  renderMovieWithShowtime(pickThisDay) {
    return this.state.schedules.map(schedule => {
      return <MovieWithShowtimeComp schedule={schedule} accid={this.state.accid} pickThisDay={pickThisDay} key={schedule.CinemaId} />
    })
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

  render() {
    resetIdCounter()
    let dataToMyTicket = {
      pathname: '/MyTickets'
    }
    const {isLoading, error, isEmpty, serverTime, dates, pickThisDay, accid, dataMyTicketsDone} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/>กดเพื่อกลับหน้าแรก</h5></Link></section>
    }
    return (
      <Layout title="Select Movie">
        {(() => {
          if (accid) {
            return (
              <div className="indexTab" key="cinemaList">
                <div className="page__selectMovieByCinema">
                  <GlobalHeaderButtonBack></GlobalHeaderButtonBack>
                  <DateFilters serverTime={serverTime} dates={dates} sliderBeforeChange={this.dateFilterSliderBeforeChange.bind(this)}></DateFilters>
                  {this.renderMovieWithShowtime(pickThisDay)}
                </div>
                <Tabs defaultIndex={1} >
                  <TabList>
                    <div className="react-tabs__tabs-container">
                        <Tab>
                          <Link prefetch href="/AllMovie">
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                              <div className="sprite-tab-menu1"></div>
                              <span className="tab-menu-title">ภาพยนต์</span>
                            </div>
                          </Link>
                        </Tab>
                      <Tab>
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
          } else {
            return (
              <section className="empty">
                <img src={empty}/>
                <h5>ข้อมูลไม่ถูกต้อง</h5>
              </section>
            )
          }
        })()}
      </Layout>
    )
  }
}

export default MainSelectMovieByCinema;

