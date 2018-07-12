import React, { Component } from 'react';
import Slider from "react-slick";

class ShowingPoster extends Component {
  render() {
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
    }
    return (
      <Slider {...settings}>
          <div key={i}>
            <img className='highlight__poster' src={this.props.item.poster_ori}/>
            <span className='highlight__title'>{this.props.item.title_th}</span>
          </div>
          <style jsx>{`
          .slick-slide{
            width: 240px !important;
          }
        `}
        </style>
        </Slider>
    );
  }
}

export default ShowingPoster;
