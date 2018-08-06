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
    }
  }
  componentDidMount(){
    try{
      fetch(`https://api-cinema.truemoney.net/MovieList`)
      .then(response => response.json())
      .then((data) => this.setState({dataObj:data.data.now_showing, isLoading: false}))
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
    {(()=>{ 
      let arr = [];
      let items = []
      for( let i = 0; i < dataObj.length; i++) {
        // localStorage.setItem(dataObj[i].title_en, JSON.stringify(dataObj[i].movieCode))
        let string = dataObj[i].title_en
        string = string.replace(/ +/g, "")
        arr.push(dataObj[i].movieCode,dataObj[i].title_en,dataObj[i].title_th,dataObj[i].poster_ori,dataObj[i].rating,dataObj[i].genre,dataObj[i].duration,dataObj[i].synopsis_th,dataObj[i].trailer)
        items.push(dataObj[i])
      }
      localStorage.setItem("now_showing", JSON.stringify(items))
    })()}
    

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
    }
    
    return (
      <div className='highlight'>
        <Slider {...settings}>
          {dataObj.map((item,i) =>
                <Fragment key={i}>
                  <img className='highlight__poster' src={item.poster_ori}/>
                  <Link prefetch href="/">
                    <a className="highlight__book-btn">ซื้อตั๋ว</a>
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
      </div>
    );
  }
}

export default HighlightCarousel;