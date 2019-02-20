import React, { PureComponent } from 'react';
import Link from 'next/link'
import Swiper from 'swiper'
import { URL_PROD } from '../lib/URL_ENV';
import * as gtag from '../lib/gtag'

class HighlightCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEmpty:false,
      isError: false,
      dataObj: [],
      advTicket: [],
      nowShowing:[],
      isLoading: true,
      arrbg:[],
      loaded:true,
      SliderObj: ''
    }
  }

  iniSlider () {
    const sliderSetting = {
      watchSlidesProgress: true,
      speed: 400,
    }
    let swiper = new Swiper(this.refs.slider, sliderSetting)
    swiper.on('slideChange', () => {
      this.sliderChange(swiper.activeIndex)
    })
    return swiper
  }
  componentWillMount(){
    this.props.highlightFetched(false)

    fetch(`${URL_PROD}/MovieList`)
    .then(response => response.json())
    .then(data => {
      let res =  data.data
      sessionStorage.setItem('allMovies', JSON.stringify(res))
      this.setState({
        nowShowing:res.now_showing,
        advTicket:res.advance_ticket,
        isLoading: false,
        isEmpty: res.now_showing.length > 0 ?  false : true,
        dataObj: [...res.now_showing, ...res.advance_ticket]
      })
      this.props.bg(this.state.arrbg[0])
      this.props.highlightFetched(true)
    })
    .then(()=>{
      this.iniSlider()
    })
    .catch((err) => {
      this.setState({
        isError: true,
        isEmpty: false,
        isLoading: false
      })
    })
  }

  movieDetails(item){
    let props = JSON.stringify(item)
    sessionStorage.setItem('movieSelect',props)

    gtag.event({
      category: 'items',
      action: 'view_item',
      label: 'nowShowingSlider'
    });
  }


  sliderChange(index){
    this.props.bg(this.state.arrbg[index])
  }

  renderPoster(){
    let dataToSelectCinemaByMovie = {
      pathname: '/SelectCinemaByMovie'
    }
    let arr = [];
    let items = []
    for( let i = 0; i < this.state.dataObj.length; i++) {
      let string = this.state.dataObj[i].title_en
      string = string.replace(/ +/g, "")
      arr.push(
        this.state.dataObj[i].movieCode,
        this.state.dataObj[i].title_en,
        this.state.dataObj[i].title_th,
        this.state.dataObj[i].poster_ori,
        this.state.dataObj[i].rating,
        this.state.dataObj[i].genre,
        this.state.dataObj[i].duration,
        this.state.dataObj[i].synopsis_th,
        this.state.dataObj[i].trailer)
      items.push(this.state.dataObj[i])
    }

    sessionStorage.setItem("now_showing", JSON.stringify(items))
    let renderItem = []
    renderItem.push(
      <div className="swiper-container" ref="slider" key="slider">
        <div className="swiper-wrapper">
          {this.state.dataObj.map((item, itemIndex) =>
            <div className="swiper-slide" key={item.title_en + itemIndex}>
              <div className="highlight__sliderItem">
                <Link prefetch href={dataToSelectCinemaByMovie}>
                  <div className="poster-container" onClick={this.movieDetails.bind(this,item)}>
                    <img className="highlight__poster" src='./static/img-placeholder-without-shadow.svg' />
                    <img className="highlight__poster" src={item.poster_ori} />
                    {(()=>{
                      if (new Date().getTime() < new Date(item.release_date).getTime()) {
                        return (
                          <div className="advanceBadge">
                            <div className="advanceBadge--text">ตั๋วล่วงหน้า</div>
                            <img className='advanceBadge--img' src='../static/advanceTicket_bg.svg'/>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </Link>
                <div className="highlight__caption">
                  {(() => {
                    this.state.arrbg.push(item.poster_ori)
                    if(item.title_en === item.title_th){
                        item.title_th = ''
                    }
                  })()}
                  <span className='highlight__title'>{item.title_en}</span>
                  <span className='highlight__subtitle'>{item.title_th}</span>
                  <Link prefetch href={dataToSelectCinemaByMovie}>
                    <a className="highlight__book-btn" onClick={this.movieDetails.bind(this,item)}>ซื้อตั๋ว</a>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
    return renderItem
  }
  render() {
    const {isError, isEmpty, isLoading} = this.state;
    if (isLoading) {
      return <img src="../static/loading.svg" className="loading"/>
    }
    if(isEmpty){
      return (
        <section className="empty isHighlight">
          <img src={empty}/>
          <h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้</h5>
        </section>
      )
    }
    if(isError){
      return (
        <section className="empty isHighlight">
          <img src={empty}/>
          <h5>ข้อมูลไม่ถูกต้อง</h5>
        </section>
      )
    }
    return (
      <div className='highlight'>
        {this.renderPoster()}
      </div>
    )
  }
}

export default HighlightCarousel;