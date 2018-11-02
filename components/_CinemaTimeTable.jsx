import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'
import utilities from '../scripts/utilities';

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

  handleScheduleSelected (itemTheaterInfo, format, time) {
    if(this.props.name ==='fromMovie'){
      sessionStorage.setItem('BookingTime',format)
      sessionStorage.setItem('BookingScreenName',this.props.item.ScreenName)
      sessionStorage.setItem('BookingAttributesNames',this.props.item.SessionAttributesNames)
      sessionStorage.setItem('CinemaID',this.props.cineId)
      sessionStorage.setItem('BookingCinema',this.props.cineName)
      sessionStorage.setItem('BookingDate',time)
    } else {
      sessionStorage.setItem('BookingTime',format)
      sessionStorage.setItem('BookingMovie',itemTheaterInfo.title_en)
      sessionStorage.setItem('BookingMovieTH',itemTheaterInfo.title_th)
      sessionStorage.setItem('BookingGenre',itemTheaterInfo.genre)
      sessionStorage.setItem('BookingDuration',itemTheaterInfo.duration)
      sessionStorage.setItem('BookingScreenName',this.props.item.ScreenName)
      sessionStorage.setItem('BookingPoster',itemTheaterInfo.poster_ori)
      sessionStorage.setItem('BookingAttributesNames',this.props.item.SessionAttributesNames)
      sessionStorage.setItem('BookingDate',time)
    }
  }

  renderSchedule(){
    let dataToSeatMap = {
      pathname: '/seatMap',
      query: ''
    }

    let resultArray = []
    this.props.item.Showtimes.map((time,i)=>{
      var today = this.props.pickedDate

      //Get date and time for today
      let now = new Date(this.props.serverTime)
      let nowtime = now.getTime()
      let nowDate = now.getDate()
      //Get date and time each schedule
      let splitHours = utilities.getStringDateTime(time).hour
      let splitMins= utilities.getStringDateTime(time).minute
      let movieTime = now.setHours(splitHours,splitMins)
      let format = utilities.getStringDateTime(time).time
      let movieDay = parseInt(utilities.getStringDateTime(time).day)
      let movienowtimeMoreThanNowtime = ''
      if (today === movieDay) {
        if(movieTime > nowtime){
          movienowtimeMoreThanNowtime = false
        } else {
          movienowtimeMoreThanNowtime = true
        }
        dataToSeatMap.query = {
          ...this.props.item,
          SessionId: this.props.item.SessionIds[i]
        }

        if(nowDate === today){
          resultArray.push(
            <PostLink key={i} link={dataToSeatMap} handleScheduleSelected={this.handleScheduleSelected.bind(this, this.props.itemTheaterInfo, format, time)} class={movienowtimeMoreThanNowtime} time={format}/>
          )
        } else {
          resultArray.push(
            <PostLink key={i} link={dataToSeatMap} handleScheduleSelected={this.handleScheduleSelected.bind(this, this.props.itemTheaterInfo, format, time)} class={false} time={format} />
          )
        }
      }
    })
    if (resultArray.length > 0) {
      return (
        <div className="movie-card__theatre-container">
          <div className="movie-card__theatre-wrapper">
            <div className="movie-card__theatre-title">{this.props.item.ScreenName}</div>
            <div className={this.props.item.FormatCode}></div>
            <div className="sprite-sound"></div>
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
