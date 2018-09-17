import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.svg'
import empty from '../static/emptyMovie.png'
import Router from 'next/router'
import Swal from 'sweetalert2'
import utilities from '../scripts/utilities';
import MovieWithShowtimeComp from '../components/MovieWithShowtimeComp';

class MainSelectMovieByCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      serverTime:'',
      isEmpty:false,
      accid: this.props.url.query.accid,
      schedules: [],
      dates: [],
      pickThisDay: 0,
    }
  }

  //this function done after render
  componentDidMount() {
    try {
      this.setState({nowShowing:JSON.parse(sessionStorage.getItem("now_showing"))})
      fetch(`https://api-cinema.truemoney.net/Schedule`,{
        method: 'POST',
        body:JSON.stringify({cinemaId:sessionStorage.getItem('CinemaID')})
      })
      .then(response => response.json())
      .then(data =>  this.setState({schedules:data.data, serverTime:data.server_time,isLoading: false}))
      .then(()=>{
        this.fillterDate()
      })
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
    // set previous route
    Router.beforePopState(() => {
      sessionStorage.setItem('previousRoute', this.props.url.pathname)
      return true
    })
  }

  goToHome() {
    Router.push({
      pathname: '/'
    })
  }

  getMonth(date) {
    var monthNames = [
      "", "ม.ค.", "ก.พ.", "มี.ค.",
      "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.",
      "ส.ค.", "ก.ย.", "ค.ค.",
      "พฤ.ย.", "ธ.ค."
    ]
    let monthIndex = date.slice(5,7)
    let month = parseInt(monthIndex)
    return monthNames[month]
  }

  fillterDate() {
    let dates = []
    let mapDates = []
    this.state.schedules.forEach(schedule => {
      schedule.Theaters.forEach(theater => {
        theater.Showtimes.forEach(showtime => {
          let strDate = showtime.substring(0, 10)
          if (!(strDate in mapDates)) {
            mapDates[strDate] = true
            dates.push(strDate)
          }
        })
      })
    })

    const stringSorter = function(a, b) {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    }
    dates.sort(stringSorter)
    this.setState({dates: dates})
    this.setState({isEmpty:(dates.length == 0)})
  }

  pickThisDay(day){
    this.setState({pickThisDay:day})
  }

  renderDates() {
    let strToday = `${this.state.serverTime.slice(8,10)} ${this.getMonth(this.state.serverTime)}`

    return this.state.dates.map((date, i) => {
      let displayDate = `${date.slice(8,10)} ${this.getMonth(date)}`
      if (strToday == displayDate) {
        displayDate = "วันนี้"
      }
      return (
        <a className={(this.state.pickThisDay == i)? 'date-filter__item active':'date-filter__item'} key={date}><span onClick={this.pickThisDay.bind(this,i)}>{displayDate}</span></a>
      )
    })
  }

  renderMovieWithShowtime() {
    return this.state.schedules.map(schedule => {
      return <MovieWithShowtimeComp schedule={schedule} accid={this.state.accid} />
    })
  }

  render() {
    const {isLoading, error, isEmpty} = this.state;
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
        <section className="date-filter">
          {this.renderDates()}
        </section>
        {this.renderMovieWithShowtime()}
        {/* <SearchCinema onSearchChange={this.onSearchChange.bind(this)} /> */}
      </Layout>
    )
  }
}

export default MainSelectMovieByCinema;

