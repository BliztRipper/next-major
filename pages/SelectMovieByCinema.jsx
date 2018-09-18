import React, { Component } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.svg'
import empty from '../static/emptyMovie.png'
import Router from 'next/router'
import DateFilters from '../components/DateFilters'
import MovieWithShowtimeComp from '../components/MovieWithShowtimeComp';

class MainSelectMovieByCinema extends Component {
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
        this.pickThisDay(0)
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
    this.setState({dates: this.state.dates})
    this.setState({isEmpty:(this.state.dates.length == 0)})
  }

  pickThisDay(index){
    this.state.pickThisDay = this.state.dates[index]
    setTimeout(() => {
      this.setState({
        pickThisDay: this.state.pickThisDay
      })
    }, 100);
  }

  dateFilterSliderBeforeChange (index)  {
    this.pickThisDay(index)
  }

  renderMovieWithShowtime() {

    return this.state.schedules.map(schedule => {
      return <MovieWithShowtimeComp schedule={schedule} accid={this.state.accid} pickThisDay={this.state.pickThisDay} key={schedule.CinemaId} />
    })
  }

  render() {
    const {isLoading, error, isEmpty, serverTime, dates} = this.state;
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
        <DateFilters serverTime={serverTime} dates={dates} sliderBeforeChange={this.dateFilterSliderBeforeChange.bind(this)}></DateFilters>
        {this.renderMovieWithShowtime()}
      </Layout>
    )
  }
}

export default MainSelectMovieByCinema;

