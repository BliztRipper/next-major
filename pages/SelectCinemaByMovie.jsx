import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.gif'
import empty from '../static/emptyMovie.png'
import CinemaTimeTable from '../components/CinemaTimeTable'
import RegionCinemaComp from '../components/RegionCinemaComp'
import utilities from '../scripts/utilities';
import { log } from 'util';

class CinemaMovieInfo extends PureComponent {
  render() {
    return (
      <Fragment>
        <div className="movie-card__container">
          <img className="movie-card__poster" src={this.props.item.poster_ori} />
          <div className="movie-card__wrapper">
            <h2 className="movie-card__title">{this.props.item.title_en}</h2>
            <h3 className="movie-card__subtitle">{this.props.item.title_th}</h3>
            <span className="movie-card__genre">{this.props.item.genre} | {this.props.item.duration} นาที</span>
            <Link prefetch href='/MovieInfo'>
              <a className="movie-card__more-detail">ดูรายละเอียดเพิ่ม</a>
            </Link>
          </div>
        </div>
        {/* <div className={this.props.class? "movie-card__more-detail-container isHide":"movie-card__more-detail-container"}>
          <p className="movie-card__synopsis">{this.props.item.synopsis_th}</p>
          <video className="movie-card__trailer" width="320" preload="auto" controls>
            <source src={`${this.props.item.trailer}.mp4#t=10`} />
            Your browser does not support the video tag.
          </video>
          <div className="movie-card__director-label">ผู้กำกับ</div>
          <div className="movie-card__director">{this.props.item.director}</div>
          <div className="movie-card__actor-label">นักแสดงนำ</div>
          <div className="movie-card__actor">{this.props.item.actor}</div>
        </div> */}
      </Fragment>
    )
  }
}

class MainSelectCinemaByMovie extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      loadFavorites: false,
      loadBranches: false,
      error: null,
      serverTime:'',
      isEmpty:false,
      branches: [],
      favorites: [],
      schedules: [],
      regions: [],
      dates: [],
      pickThisDay: 0,
      accid: this.props.url.query.accid,
    }
  }

  //this function done after render
  componentDidMount() {
    try {
      sessionStorage.setItem('CinemaID','')
      sessionStorage.setItem('BookingCinema','')
      this.setState({nowShowing:JSON.parse(sessionStorage.getItem("movieSelect"))})
      fetch(`http://127.0.0.1:2324/Schedule`,{
      // fetch(`https://api-cinema.truemoney.net/Schedule`,{
        method: 'POST',
        body:JSON.stringify({cinemaId:sessionStorage.getItem('CinemaID')})
      })
      .then(response => response.json())
      .then(data =>  {
        this.state.schedules = data.data
        this.state.serverTime = data.server_time

        fetch(`https://api-cinema.truemoney.net/FavCinemas/${this.state.accid}`)
        .then(response => response.json())
        .then(data => {
          this.state.favorites = data.data
          this.state.loadFavorites = true
          this.loadComplete()
        })

        fetch(`https://api-cinema.truemoney.net/Branches`)
        .then(response => response.json())
        .then(data=> {
          this.state.branches = data.data
          this.state.loadBranches = true
          this.loadComplete()
        })
      })
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }

  loadComplete() {
    if (this.state.loadFavorites && this.state.loadBranches) {
      this.convertDataToUse()
      this.fillterDate()
      this.setState({isLoading: false})
    }
  }

  getRegionsBySchedule(regions, schdule) {
    let result = null
    let name = ""
    Object.keys(regions).forEach(key => {
      regions[key].forEach(region => {
        if (region.cinemaId == schdule.CinemaId) {
          result = regions[key]
          name = key
          return
        }
      })
    })

    if (!name) {
      name = 'unknown'
    }
    return {region:result, name:name}
  }

  convertDataToUse() {
    //Region
    let regions = []
    this.state.branches.map(branch => {
      let key = branch.DescriptionInside.zone_name
      if (!(key in regions)) {
        regions[key] = []
      }

      regions[key].push({
        zoneId: branch.DescriptionInside.zone_id,
        zoneName: branch.DescriptionInside.zone_name,
        branchName: utilities.getNameFromBranch(branch),
        cinemaId: branch.ID,
        brandName: utilities.getBrandName(branch.DescriptionInside.brand_name_en),
        isFavorite: utilities.isFavorite(this.state.favorites, branch.ID),
      })
    })

    let toSetRegions = []
    let mapRegions = []
    this.state.schedules.forEach(schedule => {
      let region = this.getRegionsBySchedule(regions, schedule)
      if (!(region.name in mapRegions)) {
        toSetRegions.push({
          name: region.name,
          region: region.region,
          schedule: schedule,
        })

        mapRegions[region.name] = true
      }
    })

    this.setState({regions: toSetRegions})
    this.setState({isEmpty:(toSetRegions.length == 0)})
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

  favActive() {
    console.log("Click Fav");

  }

  pickThisDay(day){
    this.setState({pickThisDay:day})
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

  renderFavorite() {
    let items = []
    this.state.regions.forEach((region, i) => {
      if (utilities.isFavorite(this.state.favorites, region.schedule.CinemaId)) {
        items.push(<RegionCinemaComp region={region} isExpand={(i==0)} iAmFav={true} favActive={this.favActive}/>)
      }
    })

    return (
      <Fragment>
        {items}
      </Fragment>
    )
  }

  renderRegion() {
    return this.state.regions.map((region, i) => {
      return (
        <Fragment>
          <RegionCinemaComp region={region} isExpand={(i==0)} iAmFav={false} favActive={this.favActive}/>
        </Fragment>
      )
    })
  }

  render() {
    const {isLoading, error, isEmpty, theaterArr} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/>กดเพื่อกลับหน้าแรก</h5></Link></section>
    }
    sessionStorage.setItem('BookingMovie',this.state.nowShowing.title_en)
    sessionStorage.setItem('BookingMovieTH',this.state.nowShowing.title_th)
    sessionStorage.setItem('BookingGenre',this.state.nowShowing.genre)
    sessionStorage.setItem('BookingDuration',this.state.nowShowing.duration)
    sessionStorage.setItem('BookingPoster',this.state.nowShowing.poster_ori)

    return (
      <Layout title="Select Movie">
        <section className="date-filter">
          {this.renderDates()}
        </section>
        {this.renderFavorite()}
        {this.renderRegion()}
      </Layout>
    )
  }
}

export default MainSelectCinemaByMovie;

