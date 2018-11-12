import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.svg'
import empty from '../static/emptyMovie.png'
import Router from 'next/router'
import DateFilters from '../components/DateFilters'
import MovieWithShowtimeComp from '../components/MovieWithShowtimeComp';
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
import GlobalFooterNav from '../components/GlobalFooterNav'
import '../styles/style.scss'
import Page from '../components/Page';

class MainSelectMovieByCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      serverTime:'',
      isEmpty:false,
      accid: '',
      dataSchedules: [],
      schedules: {},
      dates: [],
      pickThisDay: false,
      highlightFetching: true,
      dataMyTicketsDone: false,
    }
  }


  componentDidMount() {
    sessionStorage.setItem('previousRoute', this.props.url.pathname)
    let nowShowing = sessionStorage.getItem("now_showing")
    let instantTickets =  JSON.parse(sessionStorage.getItem('dataMyTickets'))
    if (!nowShowing) this.goToHome()
    this.setState({
      nowShowing: JSON.parse(nowShowing),
      dataMyTicketsTotal: instantTickets ? instantTickets.length : null
    })
    try {
      fetch(`https://api-cinema.truemoney.net/Schedule`,{
        method: 'POST',
        body:JSON.stringify({cinemaId:sessionStorage.getItem('CinemaID')})
      })
      .then(response => response.json())
      .then(data => {
        this.state.dataSchedules = data.data
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

    if(this.state.dataSchedules.length === 0 || !this.state.dataSchedules) {
      this.setState({
        isEmpty:true,
        isLoading: false
      })
    } else {
      this.state.dataSchedules.forEach(schedule => {
        schedule.Theaters.forEach(theater => {
          theater.Showtimes.forEach(showtime => {
            let strDate = showtime.substring(0, 10)
            if (!(strDate in mapDates)) {
              mapDates[strDate] = true
              this.state.dates.push(strDate)
            }
          })
          if (!this.state.schedules[theater.ScheduledFilmId]) {
            this.state.schedules[theater.ScheduledFilmId] = []
          }
          this.state.schedules[theater.ScheduledFilmId].push({
            ...theater,
            CinemaId: schedule.CinemaId
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
        dataSchedules: this.state.dataSchedules,
        serverTime: this.state.serverTime,
        dates: this.state.dates,
        isEmpty:(this.state.dates.length == 0),
        accid: JSON.parse(sessionStorage.getItem("userInfo")).accid
      })
    }
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

  theaterEmptyCheck(isEmpty){
    this.setState({
      isEmpty: isEmpty
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
    const {isLoading, error, isEmpty, serverTime, dates, pickThisDay, accid} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/><button className="highlight__book-btn">กดเพื่อกลับหน้าแรก</button></h5></Link></section>
    }
    return (
      <Page>
        <Layout title="Select Movie">
          {(() => {
            if (accid) {
              return (
                <Page>
                  <div className="indexTab" key="cinemaList">
                    <div className="page__selectMovieByCinema">
                      <GlobalHeaderButtonBack></GlobalHeaderButtonBack>
                      <DateFilters serverTime={serverTime} dates={dates} sliderBeforeChange={this.dateFilterSliderBeforeChange.bind(this)}></DateFilters>
                      <MovieWithShowtimeComp theaterEmptyCheck={this.theaterEmptyCheck.bind(this)} schedules={this.state.schedules} accid={this.state.accid} pickThisDay={pickThisDay} />
                    </div>
                    <GlobalFooterNav/>
                </div>
                </Page>
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
      </Page>
    )
  }
}

export default MainSelectMovieByCinema;

