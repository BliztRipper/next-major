import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'

export default class MovieInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      movieInfo:[]
    }
  }

  componentDidMount(){
    this.setState({movieInfo:JSON.parse(sessionStorage.getItem("movieSelect"))})
  }

  render() {
    const divStyle = {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
    const titleStyle = {
      width:'100%',
      paddingLeft: '4rem',
    }
    const infoStyle = {
      padding: '0 2rem',
    }
    return (
      <Layout title="Movie Infomation">
        <div className="movie-card__container" style={divStyle}>
            <video className="movie-card__trailer" width="320" controls="true" preload="yes" type='video/mp4' poster={this.state.movieInfo.poster_ori}>
              <source src={this.state.movieInfo.trailer} type="video/webm"/>
              <source src={this.state.movieInfo.trailer} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>   
          <div className="movie-card__wrapper" style={titleStyle}>
            <h2 className="movie-info__title">{this.state.movieInfo.title_en}</h2>
            <h3 className="movie-info__subtitle">{this.state.movieInfo.title_th}</h3>
            <span className="movie-info__genre">{this.state.movieInfo.genre} | {this.state.movieInfo.duration} นาที</span>
            <div className="movie-info__relaese-label">วันเข้าฉาย</div>
            <div className="movie-info__relaese">{this.state.movieInfo.release_date}</div>
          </div>
        </div>
        <div className="movie-card__more-detail-container" style={infoStyle}>
        <p className="movie-info__synopsis">{this.state.movieInfo.synopsis_th}</p>
        <div className="movie-info__director-label">ผู้กำกับ</div>
        <div className="movie-info__director">{this.state.movieInfo.director}</div>
        <div className="movie-info__actor-label">นักแสดงนำ</div>
        <div className="movie-info__actor">{this.state.movieInfo.actor}</div>
      </div>
      </Layout>
    )
  }
}
