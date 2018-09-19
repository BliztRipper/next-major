import React, { PureComponent } from 'react';
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
      accid: this.props.url.query.accid,
      schedules: [],
      dates: [],
      pickThisDay: false,
    }
  }

  //this function done after render
  componentDidMount() {
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
    sessionStorage.setItem('previousRoute', this.props.url.pathname)
    Router.push({
      pathname: '/'
    })
  }

  fillterDate() {
    this.state.schedules = [
      {
        "CinemaId": "0000000002",
        "Theaters": [
          {
            "ScreenName": "Theatre 5",
            "ScreenNumber": 5,
            "ScreenNameAlt": "4DX",
            "FormatCode": "0000000005",
            "SessionAttributesNames": [
              "TH/--"
            ],
            "ScheduledFilmId": "HO00003411",
            "Showtimes": [
              "2018-09-19T13:00:00",
              "2018-09-19T15:00:00",
              "2018-09-19T16:30:00",
              "2018-09-19T18:00:00",
              "2018-09-19T20:00:00",
              "2018-09-19T21:00:00",
              "2018-09-20T23:10:00",
            ],
            "IsAllocatedSeating": true,
            "AllowChildAdmits": true,
            "SeatsAvailable": 116,
            "CinemaOperatorCode": "1070",
            "AllowTicketSales": true,
            "TypeCode": "N",
            "SessionIds": [
              "43333",
              "43334",
              "43335",
              "43336",
              "43337",
              "43338",
              "43339"
            ]
          },
          {
            "ScreenName": "Theatre 6",
            "ScreenNumber": 6,
            "ScreenNameAlt": "Pavalai",
            "FormatCode": "0000000005",
            "SessionAttributesNames": [
              "EN/TH"
            ],
            "ScheduledFilmId": "HO00003406",
            "Showtimes": [
              "2018-09-19T12:40:00",
              "2018-09-19T14:20:00",
              "2018-09-19T15:50:00",
              "2018-09-19T18:00:00",
              "2018-09-19T19:20:00",
              "2018-09-19T21:00:00",
              "2018-09-19T23:00:00"
            ],
            "IsAllocatedSeating": true,
            "AllowChildAdmits": true,
            "SeatsAvailable": 178,
            "CinemaOperatorCode": "1070",
            "AllowTicketSales": true,
            "TypeCode": "N",
            "SessionIds": [
              "43340",
              "43341",
              "43342",
              "43343",
              "43344",
              "43345",
              "43346"
            ]
          },
          {
            "ScreenName": "Theatre 7",
            "ScreenNumber": 7,
            "ScreenNameAlt": " 7",
            "FormatCode": "0000000005",
            "SessionAttributesNames": [
              "EN/TH"
            ],
            "ScheduledFilmId": "HO00003411",
            "Showtimes": [
              "2018-09-19T12:00:00",
              "2018-09-19T13:00:00",
              "2018-09-19T15:30:00",
              "2018-09-19T16:40:00",
              "2018-09-19T18:00:00",
              "2018-09-19T20:20:00",
              "2018-09-19T21:20:00"
            ],
            "IsAllocatedSeating": true,
            "AllowChildAdmits": true,
            "SeatsAvailable": 142,
            "CinemaOperatorCode": "1070",
            "AllowTicketSales": true,
            "TypeCode": "N",
            "SessionIds": [
              "43347",
              "43348",
              "43349",
              "43350",
              "43351",
              "43352",
              "43353"
            ]
          },
          {
            "ScreenName": "Theatre 8",
            "ScreenNumber": 8,
            "ScreenNameAlt": " 8",
            "FormatCode": "0000000005",
            "SessionAttributesNames": [
              "EN/TH"
            ],
            "ScheduledFilmId": "HO00003419",
            "Showtimes": [
              "2018-09-19T12:00:00",
              "2018-09-19T13:20:00",
              "2018-09-19T15:30:00",
              "2018-09-19T16:40:00",
              "2018-09-19T18:30:00",
              "2018-09-19T20:30:00",
              "2018-09-19T22:00:00"
            ],
            "IsAllocatedSeating": true,
            "AllowChildAdmits": true,
            "SeatsAvailable": 227,
            "CinemaOperatorCode": "1070",
            "AllowTicketSales": true,
            "TypeCode": "N",
            "SessionIds": [
              "43354",
              "43355",
              "43356",
              "43357",
              "43358",
              "43359",
              "43360"
            ]
          },
          {
            "ScreenName": "Theatre 9",
            "ScreenNumber": 9,
            "ScreenNameAlt": " 9",
            "FormatCode": "0000000005",
            "SessionAttributesNames": [
              "TH/EN"
            ],
            "ScheduledFilmId": "HO00003392",
            "Showtimes": [
              "2018-09-19T12:30:00",
              "2018-09-19T13:40:00",
              "2018-09-19T15:30:00",
              "2018-09-19T17:40:00",
              "2018-09-19T19:00:00",
              "2018-09-19T20:40:00",
              "2018-09-20T22:30:00"
            ],
            "IsAllocatedSeating": true,
            "AllowChildAdmits": true,
            "SeatsAvailable": 160,
            "CinemaOperatorCode": "1070",
            "AllowTicketSales": true,
            "TypeCode": "N",
            "SessionIds": [
              "43361",
              "43362",
              "43363",
              "43364",
              "43365",
              "43366",
              "43367"
            ]
          }
        ]
      }
    ]

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
      isEmpty:(this.state.dates.length == 0)
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
    const {isLoading, error, isEmpty, serverTime, dates, pickThisDay} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/>กดเพื่อกลับหน้าแรก</h5></Link></section>
    }
    console.log('render DateFilters');
    return (
      <Layout title="Select Movie">
        <DateFilters serverTime={serverTime} dates={dates} sliderBeforeChange={this.dateFilterSliderBeforeChange.bind(this)}></DateFilters>
        {this.renderMovieWithShowtime(pickThisDay)}
      </Layout>
    )
  }
}

export default MainSelectMovieByCinema;

