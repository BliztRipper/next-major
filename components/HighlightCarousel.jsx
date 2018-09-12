import React, { PureComponent, Fragment } from 'react';
import Slider from "react-slick";
import Link from 'next/link'
import loading from '../static/loading.svg'

class HighlightCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      arrbg:[],
    }
  }
  componentDidMount(){

    try{
      fetch(`https://api-cinema.truemoney.net/MovieList`)
      .then(response => response.json())
      .then((data) => {
        this.setState({dataObj:data.data.now_showing, isLoading: false})
        this.props.bg(this.state.arrbg[0])
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }

  movieDetails(item){
    let props = JSON.stringify(item)
    sessionStorage.setItem('movieSelect',props)
  }

  sliderChange(index){
    this.props.bg(this.state.arrbg[index])
  }

  renderPoster(){
    const settings = {
      className: "center",
      centerMode: false,
      lazyLoad: true,
      infinite: false,
      centerPadding: "30px",
      speed: 400,
      dots: false,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      touchThreshold: 8
    }
    let dataToSelectCinemaByMovie = {
      pathname: '/SelectCinemaByMovie',
      query: {
        accid: this.props.accid
      }
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
      <Slider {...settings} afterChange={this.sliderChange.bind(this)}>
        {this.state.dataObj.map((item,i) =>
          <Fragment key={i}>
            <div className="poster-container">
              <img className='highlight__poster' src={item.poster_ori!=""? item.poster_ori:'./static/img-placeholder.png'}/>
            </div>
            <Link prefetch href="/SelectCinemaByMovie">
              <a className="highlight__book-btn" onClick={this.movieDetails.bind(this,item)}>ซื้อตั๋ว</a>
            </Link>
            {(() => {
              this.state.arrbg.push(item.poster_ori)
              if(item.title_en === item.title_th){
                  item.title_th = ''
              }
            })()}
            <span className='highlight__title'>{item.title_en}</span>
            <span className='highlight__subtitle'>{item.title_th}</span>
            <span className='highlight__genre'>{item.genre}</span>
          </Fragment>
        )}
      </Slider>
    )
    return renderItem
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
      <div className='highlight'>
      {this.renderPoster()}
      </div>
    )
  }
}

export default HighlightCarousel;