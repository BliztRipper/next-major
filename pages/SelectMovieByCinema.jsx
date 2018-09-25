import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.svg'
import empty from '../static/emptyMovie.png'
import Router from 'next/router'
import DateFilters from '../components/DateFilters'
import MovieWithShowtimeComp from '../components/MovieWithShowtimeComp';

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
    }
  }

  //this function done after render
  componentDidMount() {
    sessionStorage.setItem('previousRoute', this.props.url.pathname)
    let nowShowing = sessionStorage.getItem("now_showing")
    if (!nowShowing) this.goToHome()
    this.setState({nowShowing:JSON.parse(nowShowing)})
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

  render() {
    const {isLoading, error, isEmpty, serverTime, dates, pickThisDay, accid} = this.state;
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
              <Fragment>
                <DateFilters serverTime={serverTime} dates={dates} sliderBeforeChange={this.dateFilterSliderBeforeChange.bind(this)}></DateFilters>
                {this.renderMovieWithShowtime(pickThisDay)}
              </Fragment>
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

