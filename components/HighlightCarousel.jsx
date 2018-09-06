import React, { PureComponent, Fragment } from 'react';
import Slider from "react-slick";
import Link from 'next/link'
import loading from '../static/loading.gif'

class HighlightCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      background:"",
    }
  }
  componentDidMount(){
    try{
      fetch(`https://api-cinema.truemoney.net/MovieList`)
      .then(response => response.json())
      .then((data) => {
        this.setState({dataObj:data.data.now_showing, isLoading: false})
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }

  movieDetails(item){
    let props = JSON.stringify(item)
    sessionStorage.setItem('movieSelect',props)
  }

  renderPoster(){
    const settings = {
      className: "center",
      centerMode: false,
      lazyLoad: true,
      infinite: false,
      centerPadding: "30px",
      speed: 150,
      dots: false,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      touchThreshold: 8
    }
    let renderItem = [];
    renderItem.push(
      <Slider {...settings}>
        {this.state.dataObj.map((item,i) =>
          <Fragment key={i}>
            <div className="poster-container">
              <img className='highlight__poster' src={item.poster_ori!=""? item.poster_ori:'./static/img-placeholder.png'}/>
            </div>
            <Link prefetch href="/SelectCinemaByMovie">
              <a className="highlight__book-btn" onClick={this.movieDetails.bind(this,item)}>ซื้อตั๋ว</a>
            </Link>
            {(() => {
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
    console.log(this.state.background)
    return renderItem
  }

  render() {
    const {dataObj, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    {(()=>{ 
      let arr = [];
      let items = []
      for( let i = 0; i < dataObj.length; i++) {
        let string = dataObj[i].title_en
        string = string.replace(/ +/g, "")
        arr.push(dataObj[i].movieCode,dataObj[i].title_en,dataObj[i].title_th,dataObj[i].poster_ori,dataObj[i].rating,dataObj[i].genre,dataObj[i].duration,dataObj[i].synopsis_th,dataObj[i].trailer)
        items.push(dataObj[i])
      }
      sessionStorage.setItem("now_showing", JSON.stringify(items))
    })()}
    
    return (
      <div className='highlight'>
      {this.renderPoster()}
      </div>
    )
  }
}

export default HighlightCarousel;