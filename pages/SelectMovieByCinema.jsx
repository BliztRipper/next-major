import React, { PureComponent } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.gif'
import { now } from '../node_modules/moment';


class MainSelectMovieByCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      error: null,
      nowShowing: []
      // dataForSchedule: []
    }
  }

  //this function done after render
  componentDidMount() {
    try {
      this.setState({nowShowing:JSON.parse(localStorage.getItem("now_showing"))})

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
      // console.log(item)

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
              theaters: []
            }
          }

          movies[title].theaters.push(item.Theaters[key])          
        }
      })
    })

    console.log(movies);
    
  }
  
  render() {      
    const {data, isLoading, error, nowShowing} = this.state;      
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }    
    
    this.dataForSchedule()
    
    return (      
      <Layout title="Select Movie">
        <article className="movie-card">
          <div className="movie-card__container">
            <img className="movie-card__poster" src="static/Group.png" />
            <div className="movie-card__wrapper">
              <h2 className="movie-card__title">The Hitman's Bodyguard</h2>
              <h3 className="movie-card__subtitle">แสบ ซ่าส์ แบบว่าบอดี้การ์ด</h3>
              <span className="movie-card__genre">Action/Comedy | 118 นาที</span>
              <Link prefetch href="">
                <a className="movie-card__more-detail">รายละเอียด</a>
              </Link>
            </div>
          </div>
          <div className="movie-card__theatre-container">
            <div className="movie-card__theatre-wrapper">
              <div className="movie-card__theatre-title">Theatre 5</div>
              <img className="movie-card__theatre-type" src='static/digital.png'/>
              <span>ไทย</span>
            </div>
            <div className="movie-card__timetable">
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
            </div>
          </div>
        </article>
      </Layout>
    );
  }
}

export default MainSelectMovieByCinema;

