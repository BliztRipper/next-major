import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'

const PostLink = (props) => (
  <Link prefetch href={props.link}>
    <a className={props.class? 'movie-card__showtime disable':'movie-card__showtime'} onClick={props.handleScheduleSelected}>{props.time}</a>
  </Link>
)

class CinemaTimeTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataToSeatmap: ''
    }
  }
  
  handleScheduleSelected (itemTheaterInfo, event) {
    if(this.props.name ==='fromMovie'){
      let target = event.target || event.srcElement
      target = target.innerHTML
      sessionStorage.setItem('BookingTime',target)
      sessionStorage.setItem('BookingScreenName',this.props.item.ScreenName)
      sessionStorage.setItem('BookingAttributesNames',this.props.item.SessionAttributesNames)
      sessionStorage.setItem('CinemaID',this.props.cineId)
      sessionStorage.setItem('BookingCinema',this.props.cineName)
    } else {
      let target = event.target || event.srcElement
      target = target.innerHTML
      sessionStorage.setItem('BookingTime',target)
      sessionStorage.setItem('BookingMovie',itemTheaterInfo.title_en)
      sessionStorage.setItem('BookingMovieTH',itemTheaterInfo.title_th)
      sessionStorage.setItem('BookingGenre',itemTheaterInfo.genre)
      sessionStorage.setItem('BookingDuration',itemTheaterInfo.duration)
      sessionStorage.setItem('BookingScreenName',this.props.item.ScreenName)
      sessionStorage.setItem('BookingPoster',itemTheaterInfo.poster_ori)
      sessionStorage.setItem('BookingAttributesNames',this.props.item.SessionAttributesNames)
    }
  }
 
  dd(x) {
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return d;
  }

  renderSchedule(){
    let dataToSeatMap = {
      pathname: '/seatMap',
      query: ''
    }
    let resultArray = []
    var regex1 = RegExp('^([0-9]{4})-([0-9]{2})-([0-9]{2})[Tt]([0-9]{2}:[0-9]{2}).*$','g');
    this.props.item.Showtimes.map((time,i)=>{
      //Sync with Server Time      
      // let d = new Date('2018-08-29T00:55:00')
      let d = new Date(this.props.serverTime)
      let today = '0'+this.props.pickedDate.toString()
      //Get date and time for today
      let now = new Date()
      let nowtime = now.getTime()
      //Get date and time each schedule
      let arrayDate
      while ((arrayDate = regex1.exec(time)) !== null) {}
      arrayDate = regex1.exec(time)
      let splitHours = arrayDate[4].slice(0,2)
      let splitMins= arrayDate[4].slice(-2)
      let movieTime = now.setHours(splitHours,splitMins)
      let format = arrayDate[4]
      let movienowtimeMoreThanNowtime = ''
      if (today === arrayDate[3]) {  
        if(movieTime > nowtime){
          movienowtimeMoreThanNowtime = false
        } else {
          movienowtimeMoreThanNowtime = true
        }
        dataToSeatMap.query = {
          ...this.props.item,
          SessionId: this.props.item.SessionIds[i]
        }
        resultArray.push(
          <PostLink key={i} link={dataToSeatMap} handleScheduleSelected={this.handleScheduleSelected.bind(this, this.props.itemTheaterInfo)} class={false} time={format}/>
        )
      } else {
        resultArray = []
        resultArray.push(<PostLink key={i} link={dataToSeatMap} handleScheduleSelected={this.handleScheduleSelected.bind(this, this.props.itemTheaterInfo)} class={false} time={format}/>)
      }
    }) 
    if (resultArray.length > 0) {
      return (
        <div className="movie-card__theatre-container">
          <div className="movie-card__theatre-wrapper">
            <div className="movie-card__theatre-title">{this.props.item.ScreenName}</div>
            <div className={this.props.item.FormatCode}></div>
            <span>{this.props.item.SessionAttributesNames}</span>
          </div>
          <div className="movie-card__timetable">
            {resultArray}
          </div>
        </div>
      )
    }
  }

  render() {
    return (    
      <Fragment>
        {this.renderSchedule()}
      </Fragment>
    );
  }
}

export default CinemaTimeTable;
