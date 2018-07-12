import React, { Component } from 'react';
import Slider from "react-slick";

class HighlightCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
    }
  }
  componentDidMount(){
    fetch(`http://54.169.203.113/MovieList`)
    .then(response => response.json())
    .then(data => this.setState({dataObj:data.data.comingsoon, isLoading: false}))
    .catch(error => this.setState({ error, isLoading: false }))
  }
  render() {
    const {dataObj, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <p>Loading...</p>;
    }
    const settings = {
      className: "center",
      centerMode: true,
      infinite: false,
      centerPadding: "30px",
      speed: 300,
      dots: false,
      arrows: false,
      lazyLoad: 'ondemand', 
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div className='highlight'>
        <Slider {...settings}>
          {dataObj.map((item,i) =>
                <div key={i}>
                  <img className='highlight__poster' src={item.poster_ori}/>
                  <span className='highlight__title'>{item.title_th}</span>
                </div>
              )}
        </Slider>
        <style jsx>{`
          .slick-slide{
            width: 240px !important;
          }
        `}
        </style>
      </div>
    );
  }
}

export default HighlightCarousel;