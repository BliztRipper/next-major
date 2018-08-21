import React, { PureComponent } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.gif'
import CinemaTimeTable from '../components/CinemaTimeTable'
import Router from 'next/router'
import Swal from 'sweetalert2'

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
      dataSchedule:null,
      serverTime:'',
    }
  }

  //this function done after render
  componentWillMount() {
    try {
      this.setState({nowShowing:JSON.parse(sessionStorage.getItem("now_showing"))})
      fetch(`https://api-cinema.truemoney.net/Schedule`,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({cinemaId:sessionStorage.getItem('CinemaID')})
      })
      .then(response => response.json())
      .then(data =>  this.setState({data:data.data, serverTime:data.server_time,isLoading: false}))
      .then(()=>{
        this.dataForSchedule() 
      })
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }
  

  getTitleById(filmId) {
    let info = null
    if(!this.state.nowShowing) {
      Swal({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'คุณไม่ได้เลือกโรงภาพยนต์',
        confirmButtonText: `<a onCLick={${this.goToHome()}>กลับหน้าแรก</a>`
      })
    } else{
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
  }

  dataForSchedule(){
    var movies = []
    this.state.data.map(item => {
      console.log(item);
      let info = ''
      Object.keys(item.Theaters).map(key => {
        info = this.getTitleById(item.Theaters[key].ScheduledFilmId)  
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
              showtimes: item.Theaters[key].Showtimes,
              formatCode: item.Theaters[key].FormatCode,
              genre: info.genre,
              duration: info.duration,
              synopsis_th: info.synopsis_th,
              trailer: info.trailer,
              theaters: []
            }
          }
          movies[title].theaters.push(item.Theaters[key])
        }
      })
    }) 
    this.setState({dataSchedule:movies}) 
  }

  getTimetable(){
    let cinemaTimetable = []
    let resultsArray = {
      info:[],
      time:[]
    }
    if(this.state.dataSchedule != null){
      Object.keys(this.state.dataSchedule).map(item=> {
        cinemaTimetable.push(this.state.dataSchedule[item])
      })
      cinemaTimetable.map((theaters,i)=>{
        resultsArray.info.push(<CinemaMovieInfo key={i} item={theaters}/>, resultsArray.time)
        theaters.theaters.forEach((element,j) => {
          if(element.SessionAttributesNames = 'EN/TH'){
            element.SessionAttributesNames = 'อังกฤษ'
          }
        resultsArray.time.push(<CinemaTimeTable key={'theaters' + i + 'element' + j} itemTheaterInfo={theaters} item={element} serverTime={this.state.serverTime}/>)   
        });    
        resultsArray.time = []
      })
    }
    return resultsArray
  }

  goToHome() {
    Router.push({
      pathname: '/'
    })
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
          {this.getTimetable().info}
        </article>
      </Layout>
    );
  }
}

export default MainSelectMovieByCinema;

