import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'

const PostLink = (props) => (
  <Link prefetch href={props.link}>
    <a className={props.class? 'movie-card__showtime disable':'movie-card__showtime'}>{props.time}</a>
  </Link>
)

class CinemaTimeTable extends PureComponent {
  renderSchedule(){
    let dataToSeatMap = {
      pathname: '/seatMap',
      query: this.props.item
    }
    // console.log(this.props.item);
    let resultArray = []
    this.props.item.Showtimes.map((time,i)=>{
      //Sync with Server Time      
      let d = new Date(this.props.serverTime*1000)
      let today = d.getDate()
      //Get date and time for today
      let now = new Date()
      let nowtime = now.getTime()
      //Get date and time each schedule
      let date = new Date(time*1000)
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
        resultArray.push(<PostLink key={i} link={dataToSeatMap} class={movienowtimeMoreThanNowtime} time={format}/>)
      }
    })
    return resultArray
  }
  render() {
    return (    
      <div className="movie-card__theatre-container">
        <div className="movie-card__theatre-wrapper">
          <div className="movie-card__theatre-title">{this.props.item.ScreenName}</div>
          <div className={this.props.item.FormatCode}></div>
          <span>{this.props.item.SessionAttributesNames}</span>
        </div>
        <div className="movie-card__timetable">
          {this.renderSchedule()}
        </div>
      </div>
    );
  }
}

export default CinemaTimeTable;
