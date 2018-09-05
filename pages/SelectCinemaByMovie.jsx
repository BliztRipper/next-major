import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.gif'
import empty from '../static/emptyMovie.png'
import CinemaTimeTable from '../components/CinemaTimeTable'
import utilities from '../scripts/utilities';


const TheaterHead = (props) => (
  <h4>โรงภาพยนต์ {props.name}</h4>
)

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
          <video className="movie-card__trailer" width="320" preload="auto" controls>
            <source src={`${this.props.item.trailer}.mp4#t=10`} />
            Your browser does not support the video tag.
          </video>
          <div className="movie-card__director-label">ผู้กำกับ</div>
          <div className="movie-card__director">{this.props.item.director}</div>
          <div className="movie-card__actor-label">นักแสดงนำ</div>
          <div className="movie-card__actor">{this.props.item.actor}</div>
        </div>
      </Fragment>
    )
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
      nowShowing:[],
      branchData:[],
      theaterArr:[],
      pickThisDay: 0,
      uniArr: [],
    }
  }

  //this function done after render
  componentWillMount() {
    try {
      sessionStorage.setItem('CinemaID','')
      sessionStorage.setItem('BookingCinema','')
      this.setState({nowShowing:JSON.parse(sessionStorage.getItem("movieSelect"))})
      fetch(`https://api-cinema.truemoney.net/Schedule`,{
        method: 'POST',
        body:JSON.stringify({cinemaId:sessionStorage.getItem('CinemaID')})
      })
      .then(response => response.json())
      .then(data =>  {
        this.setState({data:data.data, serverTime:data.server_time})
        let dataSchedule = data.data
        fetch(`https://api-cinema.truemoney.net/Branches`).then(response => response.json())
        .then(data=> {
          let dataBranch = data.data
          this.renderHeadCinema(dataSchedule, dataBranch)          
        })
        .then(
          () => {
            let dateArray = []
            let pureDateArray = []
            if(this.state.data != null){
              this.state.data.map(date=>{
                Object.keys(date.Theaters).map(key => {
                  dateArray.push(date.Theaters[key].Showtimes)
                })
              }) 
              dateArray.map((item,i)=>{
                for(var i=0; i < item.length; i++){
                  pureDateArray.push(parseInt(utilities.getStringDateTime(item[i]).day)) 
                }
              })
            }
  
            this.state.uniArr = [...(new Set(pureDateArray))]
            this.setState({branchData:data.data, isLoading: false})
          }
        )
      })
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }

  renderHeadCinema(dataSchedule, dataBranch){
    dataSchedule.map(cineid=>{
      dataBranch.map(branch=>{
        if(branch.ID === cineid.CinemaId){
          this.state.theaterArr.push( {
            Name:branch.Name,
            Id:branch.ID,
            Theaters:cineid.Theaters
          })
        }
      })
    })
    this.setState({theaterArr: this.state.theaterArr})
  }

  
  getTimetable(){
    let resultsArray = {
      info:[],
      theater:[],
      time:[],
    }
    resultsArray.info.push(<CinemaMovieInfo item={this.state.nowShowing}/>)
    this.state.theaterArr.map(theaters=>{
      resultsArray.theater.push(
          <TheaterHead name={theaters.Name} id={theaters.Id}/>, resultsArray.time)
          Object.keys(theaters.Theaters).map(key => {
          if(theaters.Theaters[key].SessionAttributesNames = 'EN/TH'){
            theaters.Theaters[key].SessionAttributesNames = 'อังกฤษ'
          }
          this.state.nowShowing.movieCode.map(movieCode => {
            if(theaters.Theaters[key].ScheduledFilmId === movieCode) {
              resultsArray.time.push(<CinemaTimeTable cineId={theaters.Id} cineName={theaters.Name} name='fromMovie' pickedDate={this.state.uniArr[this.state.pickThisDay]} item={theaters.Theaters[key]} serverTime={this.state.serverTime} accid={this.props.url.query.accid}/>)   
            }
          })
        })
    })
    return resultsArray
  }

  pickThisDay(day){
    this.setState({pickThisDay:day})
  }

  filterByDate(){
   return(
    this.state.uniArr.map((item,i)=>{
      let isToday = ''
      if(this.state.pickThisDay === i){isToday = true}else{isToday = false}
        return (
          <a className={isToday? 'date-filter__item active':'date-filter__item'} key={item.ID}><span onClick={this.pickThisDay.bind(this,i)}>วันที่ {item}</span></a>
        )
    })
   )
  }

  render() {      
    const {isLoading, error, isEmpty, theaterArr} = this.state;    
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
    if (theaterArr.length) {
      return (      
        <Layout title="Select Movie">
          <section className="date-filter">
          {this.filterByDate()}
          </section>
          <article className="movie-card"> 
          {this.getTimetable().info}
          {this.getTimetable().theater}
          </article>
        </Layout>
      );

    }
  }
}

export default MainSelectCinemaByMovie;

