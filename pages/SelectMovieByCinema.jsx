import React, { PureComponent } from 'react';
import Layout from "../components/Layout";
import {withRouter} from 'next/router'
import Link from 'next/link'
import loading from '../static/loading.gif'

const PostLink = (props) => (
  <Link prefetch href={props.link}>
    <a className="movie-card__showtime">{props.time}</a>
  </Link>
)

class CinemaMovieInfo extends PureComponent {
  render() {
    return (
      <div className="movie-card__container">
        <img className="movie-card__poster" src={this.props.item.poster_ori} />
        <div className="movie-card__wrapper">
          <h2 className="movie-card__title">{this.props.item.title_en}</h2>
          <h3 className="movie-card__subtitle">{this.props.item.title_th}</h3>
          <span className="movie-card__genre">{this.props.item.genre} | {this.props.item.duration} นาที</span>
          <Link prefetch href={this.props.item.trailer}>
            <a className="movie-card__more-detail">รายละเอียด</a>
          </Link>
        </div>
      </div>
    );
  }
}

class MainSelectMovieByCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      error: null,
      nowShowing: [],
      dataSchedule:null
    }
  }

  //this function done after render
  componentWillMount() {
    try {
      this.setState({nowShowing:JSON.parse(sessionStorage.getItem("now_showing"))})
      fetch(`http://api-cinema.truemoney.net/Schedule`,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({tittle:'tittle', body:sessionStorage.getItem('CinemaID')})
      })
      .then(response => response.json())
      .then(data =>  this.setState({data:data.data, isLoading: false}))
      .then(()=>{
        this.dataForSchedule()
      })
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }

  getTitleById(filmId) {
    var info = null
    this.state.nowShowing.map(movie => {
      if (movie.movieCode != null) {
        movie.movieCode.map(movieId => {
          if (filmId == movieId) {         
            info = movie
          }
        })
      }
    })
    return info
  }
  
  dataForSchedule(){
    var movies = []
    this.state.data.map(item => {
      Object.keys(item.Theaters).map(key => {
        var info = this.getTitleById(item.Theaters[key].ScheduledFilmId)       
        if (info == null) {
          console.log("fileId is not found in now showing wait to fix"); 
        } else {
          let title = info.title_en.replace(/ +/g, "")
          if (title == "") {
            title = "unknown"
          }
          if (!(title in movies)) {
            movies[title] = []
            movies[title] = {
              title_en: info.title_en,
              title_th: info.title_th,
              poster_ori: info.poster_ori,
              cinema_id: item.CinemaId,
              genre: info.genre,
              duration: info.duration,
              synopsis_th: info.synopsis_th,
              trailer: info.trailer,
              theaters: []
            }
          }
          movies[title].theaters.push(item.Theaters[key])
          this.setState({dataSchedule:movies})
        }
      })
    })
  }

  renderMovieInfo(){
    if(this.state.dataSchedule != null){
      let resultsArray = []
      Object.keys(this.state.dataSchedule ).map((key,i) => {
        resultsArray.push(<CinemaMovieInfo key={i} item={this.state.dataSchedule[key]}/>)
      })
      return resultsArray
    }
  }

  render() {      
    const {isLoading, error} = this.state;      
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }    

    return (      
      <Layout title="Select Movie">
        <article className="movie-card"> 
          {this.renderMovieInfo()}
          <div className="movie-card__theatre-container">
            <div className="movie-card__theatre-wrapper">
              <div className="movie-card__theatre-title">Theatre 5</div>
              <img className="movie-card__theatre-type" src='static/digital.png'/>
              <span>ไทย</span>
            </div>
            <div className="movie-card__timetable">
              <PostLink link="/" time="15:00" />
            </div>
          </div>
        </article>
      </Layout>
    );
  }
}

export default MainSelectMovieByCinema;
