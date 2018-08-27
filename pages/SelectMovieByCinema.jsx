import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.gif'
import empty from '../static/emptyMovie.png'
import CinemaTimeTable from '../components/CinemaTimeTable'
import Router from 'next/router'
import Swal from 'sweetalert2'

class CinemaMovieInfo extends PureComponent {
  state = {
    isToggle: false
  }
  toggleDetail(){
    this.setState(prev => ({ isToggle: !prev.isToggle }))
  }
  render() {
    return (
      <Fragment>
        <div className="movie-card__container">
          <img className="movie-card__poster" src={this.props.item.poster_ori} />
          <div className="movie-card__wrapper">
            <h2 className="movie-card__title">{this.props.item.title_en}</h2>
            <h3 className="movie-card__subtitle">{this.props.item.title_th}</h3>
            <span className="movie-card__genre">{this.props.item.genre} | {this.props.item.duration} นาที</span>
            <a className="movie-card__more-detail" onClick={this.toggleDetail.bind(this)}>{this.state.isToggle? 'ซ่อนรายละเอียด':'แสดงรายละเอียด'}</a>
          </div>
        </div>
          <div className={this.state.isToggle? 'movie-card__more-detail-container isActive':'movie-card__more-detail-container isHide'}>
            <p className="movie-card__synopsis">{this.props.item.synopsis_th}</p>
            <video className="movie-card__trailer" width="320" controls>
              <source src={this.props.item.trailer} />
              Your browser does not support the video tag.
            </video>
            <div className="movie-card__director-label">ผู้กำกับ</div>
            <div className="movie-card__director">{this.props.item.director}</div>
            <div className="movie-card__actor-label">นักแสดงนำ</div>
            <div className="movie-card__actor">{this.props.item.actor}</div>
          </div>
    </Fragment>
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
      isEmpty:false,
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
        confirmButtonText: this.goToHome(),
        showConfirmButton: false,
        timer: 3000
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
              sessionids: item.Theaters[key].SessionIds,
              formatCode: item.Theaters[key].FormatCode,
              genre: info.genre,
              duration: info.duration,
              synopsis_th: info.synopsis_th,
              trailer: info.trailer,
              actor: info.actor,
              director: info.director,
              theaters: []
            }
          }
          movies[title].theaters.push(item.Theaters[key])
        }
      })
    }) 
    this.setState({dataSchedule:movies})
    if(this.state.data.length <= 0){
      this.setState({isEmpty:true})
    }
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

  filterThisDay(){
    let dayretrive = this.refs.showtoday.innerText
    console.log(dayretrive);
  }

  renderByDate(){
    let dateArray = []
    let pureDateArray = []
    let todaydate = new Date().getDate()
    if(this.state.dataSchedule != null){
      Object.keys(this.state.dataSchedule).map(date=>{
        dateArray.push(this.state.dataSchedule[date])
      })
      dateArray.map((item,i)=>{
        for(var i=0; i < item.showtimes.length; i++){
          let toDateFormat = new Date(item.showtimes[i])
          let getDate = toDateFormat.getDate()
          pureDateArray.push(getDate)
        }
      })
      console.log(dateArray,'dateArray');
    }
    let uniArr = [...(new Set(pureDateArray))];
   return(
    uniArr.map(item=>{
      let isToday = ''
      if(todaydate === item){isToday = true}else{isToday = false}
        return (
          <a onClick={this.filterThisDay.bind(this)} ref="showtoday" className={isToday? 'date-filter__item active':'date-filter__item'} key={item.ID}><span>วันที่ {item}</span></a>
        )
    })
   )
  }

  goToHome() {
    Router.push({
      pathname: '/'
    })
  }

  render() {      
    const {isLoading, error, isEmpty} = this.state;    
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/>กดเพื่อกลับหน้าแรก</h5></Link></section>
    }    
    return (      
      <Layout title="Select Movie">
        <section className="date-filter">
        {this.renderByDate()}
        </section>
        <article className="movie-card"> 
          {this.getTimetable().info}
        </article>
      </Layout>
    );
  }
}

export default MainSelectMovieByCinema;

