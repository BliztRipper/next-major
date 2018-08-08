import React, { Component } from 'react';
import Link from 'next/link'

const PostLink = (props) => (
  <Link prefetch href={props.link}>
    <a className="movie-card__showtime">{props.time}</a>
  </Link>
)

class CinemaTimeTable extends Component {
  render() {
    return (
      <div className="movie-card__theatre-container">
        <div className="movie-card__theatre-wrapper">
          <div className="movie-card__theatre-title">{this.props.ScreenName}</div>
          <img className="movie-card__theatre-type" src='static/digital.png'/>
          <span>{this.props.SessionAttributesNames}</span>
        </div>
        <div className="movie-card__timetable">
          <PostLink link="/" time="15:00" />
        </div>
      </div>
    );
  }
}

export default CinemaTimeTable;
