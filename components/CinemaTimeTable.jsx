import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'

const PostLink = (props) => (
  <Link prefetch href={props.link}>
    <a className={props.class? 'movie-card__showtime disable':'movie-card__showtime'}>{props.time}</a>
  </Link>
)

class CinemaTimeTable extends PureComponent {
  renderSchedule(){
    let resultArray = []
    this.props.item.Showtimes.map((time,i)=>{
      let d = new Date(this.props.serverTime)
      let today = d.getDate() //วันที่ 10
      let now = new Date(this.props.serverTime)
      let nowtime = now.getTime()
      let date = new Date(time)
      let movienowtime = date.getTime()
      let playDate = date.getDate() //วันที่ 9
      // console.log(nowtime, 'nowtime')
      // console.log(nowtime, 'nowtime')
      // console.log(movienowtime, 'movienowtime')
      if (today === playDate) {
        if(movienowtime > nowtime){
          let format = date.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
          resultArray.push(<PostLink key={i} link='/seatMap' class={false} time={format}/>)
        } else {
          let format = date.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
          resultArray.push(<PostLink key={i} link='/seatMap' class={true} time={format}/>)
        }
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
