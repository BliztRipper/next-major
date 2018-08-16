import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'

const PostLink = (props) => (
  <Link prefetch href={props.link}>
    <a 
      className={props.class? 'movie-card__showtime disable':'movie-card__showtime'}
      onClick={props.handleScheduleSelected}
    >{props.time}</a>
  </Link>
)

class CinemaTimeTable extends PureComponent {
  constructor(props) {
    super(props);
    this.movieData = this.movieData.bind(this);
  }

  movieData(event){
    let target = event.target || event.srcElement;
    target = target.innerHTML
    sessionStorage.setItem('BookingTime',target)
  }

  handleScheduleSelected (itemTheaterInfo) {
    console.log(this, 'this')
    console.log(itemTheaterInfo, 'itemTheaterInfo')
  }
  renderSchedule(){
    let dataToSeatMap = {
      // pathname: '/seatMap',
      query: this.props.item
    }
    let resultArray = []
    this.props.item.Showtimes.map((time,i)=>{
      //Sync with Server Time      
      let d = new Date(this.props.serverTime)
      let today = d.getDate()
      //Get date and time for today
      let now = new Date()
      let nowtime = now.getTime()
      //Get date and time each schedule
      let date = new Date(time)
      let movienowtime = date.getTime()
      let playDate = date.getDate()
      if (today === playDate) {
        let format = date.getHours()+':'+('0'+date.getMinutes()).slice(-2)
        let movienowtimeMoreThanNowtime = ''
        if(movienowtime > nowtime){
          movienowtimeMoreThanNowtime = false
        } else {
          movienowtimeMoreThanNowtime = true
        }
        resultArray.push(          
        <PostLink key={i} link={dataToSeatMap} handleScheduleSelected={this.handleScheduleSelected.bind(this, this.props.itemTheaterInfo)} class={movienowtimeMoreThanNowtime} time={format}/>
      )
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
          <div className="movie-card__timetable" onClick={this.movieData}>
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
