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
    isToggle: true
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

class MainSelectCinemaByMovie extends PureComponent { 
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      error: null,
      serverTime:'',
      isEmpty:false,
      nowShowing:[]
    }
  }

  //this function done after render
  componentWillMount() {
    try {
      this.setState({nowShowing:JSON.parse(sessionStorage.getItem("movieSelect"))})
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
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }

  getTimetable(){
    let resultsArray = {
      info:[],
      time:[]
    }
    resultsArray.info.push(<CinemaMovieInfo item={this.state.nowShowing}/>)
    this.state.data.map(theaters=>{
        Object.keys(theaters.Theaters).map(key => {
        if(theaters.Theaters[key].SessionAttributesNames = 'EN/TH'){
          theaters.Theaters[key].SessionAttributesNames = 'อังกฤษ'
        }
        resultsArray.time.push(<CinemaTimeTable key={theaters.Theaters[key].ScreenName} name='fromMovie' itemTheaterInfo={theaters.Theaters[key]} item={theaters.Theaters[key]} serverTime={this.state.serverTime}/>)   
      });    
    })
    return resultsArray
  }


  renderMovie(){
    return(<CinemaMovieInfo item={this.state.nowShowing}/>)
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
    sessionStorage.setItem('BookingMovie',this.state.nowShowing.title_en)
    sessionStorage.setItem('BookingMovieTH',this.state.nowShowing.title_th)
    sessionStorage.setItem('BookingGenre',this.state.nowShowing.genre)
    sessionStorage.setItem('BookingDuration',this.state.nowShowing.duration)
    sessionStorage.setItem('BookingPoster',this.state.nowShowing.poster_ori)
    console.log(this.state.data);
    
    return (      
      <Layout title="Select Movie">
        {/* <section className="date-filter">
        {this.renderByDate()}
        </section> */}
        <article className="movie-card"> 
        {this.getTimetable().info}
        {this.getTimetable().time}
        </article>
      </Layout>
    );
  }
}

export default MainSelectCinemaByMovie;

