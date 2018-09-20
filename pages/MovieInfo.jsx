import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";

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

  formatDate(date){
    var monthNames = [
      "", "มกราคม", "กุมภาพันธ์", "มีนาคม",
      "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม",
      "สิงหาคม", "กันยายน", "ตุลาคม",
      "พฤษจิกายน", "ธันวาคม"
    ]
    if (date != undefined){
      var d = date.slice(8,11)
      let monthIndex = date.slice(5,7)
      var month = parseInt(monthIndex)
      var y = date.slice(0,4)
    }
    return d+" "+monthNames[month]+" "+y
  }

  checkMovieImg(img){
    if(!img){
      return '../static/empty2.png'
    }
    return img
  }

  render() {
    const divStyle = {
      position:'relative',
      display: 'flex',
      marginTop:'1rem'
    }
    const titleStyle = {
      width:'100%',
    }
    const infoStyle = {
      padding: '0 0.4rem',
    }
    return (
      <Layout title="Movie Infomation">
        <div className="movie-card__bg">
          <img src={this.state.movieInfo.movie_image}/>
        </div>
        <video className="movie-card__trailer" playsInline controls width="100%" preload="yes" poster={this.state.movie_image}>
          <source src={this.state.movieInfo.tr_ios} type="application/x-mpegURL"/>
          <source src={this.state.movieInfo.tr_mp4} type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
        <div className="movie-card__container" style={divStyle}>
          <img className="movie-card__poster" src={this.state.movieInfo.poster_ori} />
          <div className="movie-card__wrapper" style={titleStyle}>
            <h2 className="movie-card__title">{this.state.movieInfo.title_en}</h2>
            <h3 className="movie-card__subtitle">{this.state.movieInfo.title_th}</h3>
            <span className="movie-card__genre">{this.state.movieInfo.genre} | {this.state.movieInfo.duration} นาที</span><br/>
            <div className="movie-card__rating">{this.state.movieInfo.rating}</div>
          </div>
        </div>
        <div className="movie-card__relaese-wrapper">
          <div className="movie-card__relaese-label">วันเข้าฉาย</div>
          <div className="movie-card__relaese">{this.formatDate(this.state.movieInfo.release_date)}</div>
        </div>
        <div className="movie-card__more-detail-container" style={infoStyle}>
        <p className="movie-card__synopsis">{this.state.movieInfo.synopsis_th}</p>
        <div className="movie-info__director-label">ผู้กำกับ</div>
        <div className="movie-info__director">{this.state.movieInfo.director}</div>
        <div className="movie-info__actor-label">นักแสดงนำ</div>
        <div className="movie-info__actor">{this.state.movieInfo.actor}</div>
      </div>
      </Layout>
    )
  }
}
