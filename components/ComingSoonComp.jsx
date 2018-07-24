import React, { Component } from 'react';
import MovieOfMonth from './MovieOfMonth'
import AllMoviePLaceholder from './AllMoviePlaceHolder'
import MoviePoster from './MoviePoster';

class CominSoonComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      monthMovie:[],
    }
  }

  componentDidMount(){
    fetch(`http://54.169.203.113/MovieList`)
    .then(response => response.json())
    .then(data => this.setState({dataObj:data.data, isLoading: false}))
    .catch(error => this.setState({ error, isLoading: false }))
  }

  convertToYearMonth(dateString) {
    if (dateString.length >= 7){
      return this.tryParseDateFromString(dateString)
    }
    return 
  }

  tryParseDateFromString(dateString){
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const d = new Date(dateString);
    return monthNames[d.getMonth()]+' '+d.getFullYear()
  }


  render() {
    const {dataObj, isLoading, error, monthMovie} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <AllMoviePLaceholder/>
    }

    dataObj.comingsoon.map(movie => {
      let key = this.convertToYearMonth(movie.release_date)
      if (key in monthMovie == false){
        monthMovie[key] = []
      } 
      monthMovie[key].push({title: movie.title_th, poster:movie.poster_ori,})
    })
    
    const htmlLines = []
    {(() => {
      for (var month in monthMovie) {
        htmlLines.push(<MovieOfMonth title={month} key={month}/>)
        monthMovie[month].map((movie,i) => {
          // htmlLines.push(<MoviePoster title={movie.title} poster={movie.poster_ori} key={movie.title+i}/>)
          htmlLines.push(<MoviePoster movies={monthMovie[month]} key={movie.title+i}/>)
        })
      }
    })()}
    return (
      <section className="comingsoon">
        {htmlLines}
      </section>
    );
  }
}

export default CominSoonComp;
