import React, { PureComponent } from 'react'
import MovieOfMonth from './MovieOfMonth'
import MoviePoster from './MoviePoster'


class CominSoonComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: this.props.dataObj,
      monthMovie:[],
      renderMovie: [],
    }
  }

  convertToYearMonth(dateString) {
    if (dateString.length >= 7){
      return this.tryParseDateFromString(dateString)
    }
    return
  }

  tryParseDateFromString(dateString){
    let monthly = this.formatMonthly(dateString)
    return monthly
  }

  formatMonthly(date) {
    var monthNames = [
      "", "มกราคม", "กุมภาพันธ์", "มีนาคม",
      "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม",
      "สิงหาคม", "กันยายน", "ตุลาคม",
      "พฤษจิกายน", "ธันวาคม"
    ]
    let monthIndex = date.slice(5,7)
    let month = parseInt(monthIndex)
    let year = date.slice(0,4)
    return monthNames[month]+" "+year
  }

  formatDate(date) {
    var monthNames = [
      "", "มกราคม", "กุมภาพันธ์", "มีนาคม",
      "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม",
      "สิงหาคม", "กันยายน", "ตุลาคม",
      "พฤษจิกายน", "ธันวาคม"
    ]
    let d = date.slice(8,10)
    let day = parseInt(d)
    let monthIndex = date.slice(5,7)
    let month = parseInt(monthIndex)
    return day + ' ' + monthNames[month]
  }

  render() {
    const {dataObj, monthMovie, renderMovie} = this.state;

    dataObj.comingsoon.map(movie => {
      let key = this.convertToYearMonth(movie.release_date)
      if (key in monthMovie == false){
        monthMovie[key] = []
      }
      monthMovie[key].push({
        title_th: movie.title_th,
        title_en: movie.title_en,
        poster_ori:movie.poster_ori,
        genre:movie.genre,
        rating:movie.rating,
        synopsis_th:movie.synopsis_th,
        actor:movie.actor,
        director:movie.director,
        release_date:movie.release_date,
        tr_ios:movie.tr_ios,
        tr_mp4:movie.tr_mp4,
      })
    })
    var cells = []
    {(() => {
      for (var month in monthMovie) {
        renderMovie.push(<MovieOfMonth title={month} key={month}/>)
        monthMovie[month].map((movie,i) => {
          let releaseDate = this.formatDate(movie.release_date)
          console.log(movie)
          cells.push(<MoviePoster item={movie} title_th={movie.title_th} release={releaseDate} poster={movie.poster_ori} key={movie.title+i}/>)
        })
        renderMovie.push(
          <div className="comingsoon__container" key={month+'comingsoon__container'}>
            {cells}
          </div>
        )
        cells = []
      }
    })()}
    return (
      <section className="comingsoon">
          {renderMovie}
      </section>
    );
  }
}



export default CominSoonComp;
