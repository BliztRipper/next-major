import React, { PureComponent } from 'react';
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
      movies: {},
      dates: [],
      pickThisDay: false,
      highlightFetching: true,
      dataMyTicketsDone: false,
      selectBy:'cinema'
    }
  }

  componentDidMount() {
    sessionStorage.setItem('previousRoute', this.props.url.pathname)
    let instantTickets =  JSON.parse(sessionStorage.getItem('dataMyTickets'))
    try {
      fetch(`${URL_PROD}/Schedule`,{
        method: 'POST',
        body:JSON.stringify({cinemaId:sessionStorage.getItem('CinemaID')})
      })
      .then(response => response.json())
      .then(data => {
        if (data.status_code === 0) {
          this.setState({
            dataSchedules: data.data,
            serverTime: data.server_time,
            dataMyTicketsTotal: instantTickets ? instantTickets.length : null
          })

          this.fillterDate()
        } else {
          this.goToHome()
        }
      })
    } catch (error) {
      error => {
        this.setState({ error, isLoading: false })}
        this.goToHome()
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

      this.state.dataSchedules.forEach(cinemaBranch => {
        cinemaBranch.Theaters.forEach(theatre => {
          theatre.MovieInTheaters.forEach(movie => {
            let strDate = movie.Showtimes.substring(0, 10)
            if (!(strDate in mapDates)) {
              mapDates[strDate] = true
              instantDates.push(strDate)
            }
            if (!this.state.movies[movie.ScheduledFilmId]) {
              this.state.movies[movie.ScheduledFilmId] = {
                CinemaId: cinemaBranch.CinemaId,
                schedules: []
              }
            }
            this.state.movies[movie.ScheduledFilmId].schedules.push({
              ...theatre,
              ...movie
            })
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
    const {isLoading, error, isEmpty, serverTime, dates, pickThisDay, accid, movies, selectBy} = this.state;

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
                    <MovieWithShowtimeComp movies={movies} accid={accid} pickThisDay={pickThisDay} />
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

