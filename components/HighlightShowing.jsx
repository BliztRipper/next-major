import React, { Component } from 'react';
import Slider from "react-slick";

class HighlightCarousel extends Component {
  render() {
    const settings = {
      className: "center",
      centerMode: true,
      infinite: false,
      centerPadding: "60px",
      speed: 300,
      dots: false,
      arrows: false,
      lazyLoad: 'ondemand', 
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div>
        <Slider {...settings}>
          <div>
            <h3 className="header-tab">กำลังฉาย</h3>
          </div>
          <div>
            <h3 className="header-tab">เร็วๆนี้</h3>
          </div>
          <div>
            <h3 className="header-tab">ตุลาคม 2017</h3>
          </div>
        </Slider>
      </div>
    );
  }
}

export default HighlightCarousel;