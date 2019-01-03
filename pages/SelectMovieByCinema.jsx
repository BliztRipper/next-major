import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout"
import Link from 'next/link'
import loading from '../static/loading.svg'
import empty from '../static/icon-film-empty.svg'
import Router from 'next/router'
import DateFilters from '../components/DateFilters'
import MovieWithShowtimeComp from '../components/MovieWithShowtimeComp'
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
import GlobalFooterNav from '../components/GlobalFooterNav'
import '../styles/style.scss'
import { URL_PROD } from '../lib/URL_ENV'

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
      selectBy:'cinema'
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
      fetch(`${URL_PROD}/Schedule`,{
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
    let instantDates = []
    if (this.state.dataSchedules && this.state.dataSchedules.length > 0) {

      this.state.dataSchedules.forEach(schedule => {
        schedule.Theaters.forEach(theater => {
          theater.Showtimes.forEach(showtime => {
            let strDate = showtime.substring(0, 10)
            if (!(strDate in mapDates)) {
              mapDates[strDate] = true
              instantDates.push(strDate)
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
      instantDates.sort(stringSorter)

      this.setState({
        dataSchedules: this.state.dataSchedules,
        serverTime: this.state.serverTime,
        dates: instantDates,
        accid: JSON.parse(sessionStorage.getItem("userInfo")).accid
      }, () => {
        this.pickThisDay(0, true)
      })

    } else {
      this.setState({
        isEmpty: true,
        isLoading: false
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

  render() {
    const {isLoading, error, isEmpty, serverTime, dates, pickThisDay, accid, schedules, selectBy} = this.state;

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
      <Layout title="Select Movie">
        {(() => {
          if (accid) {
            return (
              <Layout>
                <div className="indexTab" key="cinemaList">
                  <div className="page__selectMovieByCinema">
                    <GlobalHeaderButtonBack></GlobalHeaderButtonBack>
                    <DateFilters serverTime={serverTime} dates={dates} sliderBeforeChange={this.dateFilterSliderBeforeChange.bind(this)}></DateFilters>
                    <MovieWithShowtimeComp schedules={schedules} accid={accid} pickThisDay={pickThisDay} />
                  </div>
                  <GlobalFooterNav selectBy={selectBy}/>
                </div>
              </Layout>
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

