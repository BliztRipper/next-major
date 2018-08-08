import React, { PureComponent } from 'react';
import Link from 'next/link'

const PostLink = (props) => (
  <Link prefetch href={props.link}>
    <a className="movie-card__showtime">{props.time}</a>
  </Link>
)

class CinemaTimeTable extends PureComponent {

  renderSchedule(){
    let resultArray = []
    this.props.item.Showtimes.map(time=>{
      // let today = new Date()
      let date = new Date(time)
      let format = date.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', date:'2-digit'})
      let format2 = date.toLocaleDateString()
      console.log(format2);
      
      resultArray.push(<PostLink link='/' time={format}/>)
    })
    return resultArray
  }
  render() {
    return (
      <div className="movie-card__theatre-container">
        <div className="movie-card__theatre-wrapper">
          <div className="movie-card__theatre-title">{this.props.item.ScreenName}</div>
          <img className="movie-card__theatre-type" src='static/digital.png'/>
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
