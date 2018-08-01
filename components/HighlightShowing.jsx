import React, { PureComponent } from 'react';
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
    }
  }
  componentDidMount(){
    try{
      fetch(`https://api-cinema.truemoney.net/MovieList`)
      .then(response => response.json())
      .then((data) => this.setState({dataObj:data.data.comingsoon, isLoading: false}))
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  render() {
    const {dataObj, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    const settings = {
      className: "center",
      centerMode: true,
      lazyLoad: true,
      infinite: false,
      centerPadding: "30px",
      speed: 300,
      dots: false,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div className='highlight'>
        <Slider {...settings}>
          {dataObj.map((item,i) =>
                <div key={i}>
                  <img className='highlight__poster' src={item.poster_ori}/>
                  <Link prefetch href="/">
                    <a className="highlight__book-btn">ซื้อตั๋ว</a>
                  </Link>
                  <span className='highlight__title'>{item.title_en}</span>
                  <span className='highlight__subtitle'>{item.title_th}</span>
                  <span className='highlight__genre'>{item.genre}</span>
                </div>
              )}
        </Slider>
      </div>
    );
  }
}

export default HighlightCarousel;