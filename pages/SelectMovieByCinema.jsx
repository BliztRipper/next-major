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
        this.state.schedules = [{
          "CinemaId": "0000000002",
          "Theaters": [
            {
              "ScreenName": "Theatre 5",
              "ScreenNumber": 5,
              "ScreenNameAlt": "4DX",
              "FormatCode": "0000000002",
              "SessionAttributesNames": [
                "TH/--"
              ],
              "ScheduledFilmId": "HO00003426",
              "Showtimes": [
                "2018-09-24T15:30:00",
                "2018-09-24T16:40:00",
                "2018-09-24T18:00:00",
                "2018-09-24T18:00:00",
                "2018-09-24T20:20:00",
                "2018-09-24T20:20:00",
                "2018-09-24T22:00:00",
                "2018-09-25T22:00:00",
                "2018-09-26T00:00:00"
              ],
              "IsAllocatedSeating": true,
              "AllowChildAdmits": true,
              "SeatsAvailable": 194,
              "CinemaOperatorCode": "1070",
              "AllowTicketSales": true,
              "TypeCode": "N",
              "SessionIds": [
                "43921",
                "43922",
                "43923",
                "43956",
                "43957",
                "43958",
                "43959",
                "43960",
                "43961"
              ]
            },
            {
              "ScreenName": "Theatre 6",
              "ScreenNumber": 6,
              "ScreenNameAlt": "Pavalai",
              "FormatCode": "0000000002",
              "SessionAttributesNames": [
                "TH/EN"
              ],
              "ScheduledFilmId": "HO00003430",
              "Showtimes": [
                "2018-09-27T16:30:00",
                "2018-09-28T17:00:00",
                "2018-09-29T19:00:00",
                "2018-09-30T19:00:00",
                "2018-09-24T21:20:00",
                "2018-09-24T22:20:00",
                "2018-09-24T23:20:00",
                "2018-09-25T00:30:00"
              ],
              "IsAllocatedSeating": true,
              "AllowChildAdmits": true,
              "SeatsAvailable": 184,
              "CinemaOperatorCode": "1070",
              "AllowTicketSales": true,
              "TypeCode": "N",
              "SessionIds": [
                "43927",
                "43928",
                "43929",
                "43962",
                "43963",
                "43964",
                "43965",
                "43966",
                "43967"
              ]
            },
            {
              "ScreenName": "Theatre 7",
              "ScreenNumber": 7,
              "ScreenNameAlt": " 7",
              "FormatCode": "0000000002",
              "SessionAttributesNames": [
                "EN/TH"
              ],
              "ScheduledFilmId": "HO00003426",
              "Showtimes": [
                "2018-09-24T15:20:00",
                "2018-09-24T15:20:00",
                "2018-09-24T17:00:00",
                "2018-09-24T17:40:00",
                "2018-09-24T19:00:00",
                "2018-09-24T19:30:00",
                "2018-09-24T20:30:00",
                "2018-09-24T21:20:00",
                "2018-10-01T20:30:00"
              ],
              "IsAllocatedSeating": true,
              "AllowChildAdmits": true,
              "SeatsAvailable": 174,
              "CinemaOperatorCode": "1070",
              "AllowTicketSales": true,
              "TypeCode": "N",
              "SessionIds": [
                "43932",
                "43933",
                "43934",
                "43935",
                "43968",
                "43969",
                "43970",
                "43971",
                "43972",
                "43973"
              ]
            },
            {
              "ScreenName": "Theatre 8",
              "ScreenNumber": 8,
              "ScreenNameAlt": " 8",
              "FormatCode": "0000000002",
              "SessionAttributesNames": [
                "EN/TH"
              ],
              "ScheduledFilmId": "HO00003431",
              "Showtimes": [
                "2018-09-24T15:20:00",
                "2018-09-24T17:00:00",
                "2018-09-24T17:40:00",
                "2018-09-24T19:00:00",
                "2018-09-24T19:30:00",
                "2018-09-24T20:40:00",
                "2018-09-24T20:40:00",
                "2018-09-24T23:00:00",
                "2018-09-24T23:00:00",
                "2018-09-25T00:30:00"
              ],
              "IsAllocatedSeating": true,
              "AllowChildAdmits": true,
              "SeatsAvailable": 229,
              "CinemaOperatorCode": "1070",
              "AllowTicketSales": true,
              "TypeCode": "N",
              "SessionIds": [
                "43938",
                "43939",
                "43940",
                "43941",
                "43974",
                "43975",
                "43976",
                "43977",
                "43978",
                "43979"
              ]
            },
            {
              "ScreenName": "Theatre 10",
              "ScreenNumber": 10,
              "ScreenNameAlt": "10",
              "FormatCode": "VS00000001",
              "SessionAttributesNames": [
                "TH/EN"
              ],
              "ScheduledFilmId": "HO00003430",
              "Showtimes": [
                "2018-09-24T15:30:00",
                "2018-09-24T16:40:00",
                "2018-09-24T18:00:00",
                "2018-09-24T18:00:00",
                "2018-09-24T19:30:00",
                "2018-09-24T19:30:00",
                "2018-09-24T21:30:00",
                "2018-09-24T21:30:00",
                "2018-09-24T23:40:00",
                "2018-09-24T23:40:00",
                "2018-09-25T00:40:00"
              ],
              "IsAllocatedSeating": true,
              "AllowChildAdmits": true,
              "SeatsAvailable": 215,
              "CinemaOperatorCode": "1070",
              "AllowTicketSales": true,
              "TypeCode": "N",
              "SessionIds": [
                "43945",
                "43946",
                "43947",
                "43948",
                "43980",
                "43981",
                "43982",
                "43983",
                "43984",
                "43985",
                "43986"
              ]
            },
            {
              "ScreenName": "Theatre 11",
              "ScreenNumber": 11,
              "ScreenNameAlt": "11",
              "FormatCode": "VS00000001",
              "SessionAttributesNames": [
                "TH/EN"
              ],
              "ScheduledFilmId": "HO00003430",
              "Showtimes": [
                "2018-09-24T15:20:00",
                "2018-09-24T16:30:00",
                "2018-09-24T17:00:00",
                "2018-09-24T18:00:00",
                "2018-09-24T18:00:00",
                "2018-09-24T20:00:00",
                "2018-09-24T20:00:00",
                "2018-09-24T22:00:00",
                "2018-09-24T22:00:00",
                "2018-09-24T23:40:00",
                "2018-09-24T23:40:00"
              ],
              "IsAllocatedSeating": true,
              "AllowChildAdmits": true,
              "SeatsAvailable": 134,
              "CinemaOperatorCode": "1070",
              "AllowTicketSales": true,
              "TypeCode": "N",
              "SessionIds": [
                "43952",
                "43953",
                "43954",
                "43955",
                "43987",
                "43988",
                "43989",
                "43990",
                "43991",
                "43992",
                "43993"
              ]
            }
          ]
        }]
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

