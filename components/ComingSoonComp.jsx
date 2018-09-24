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
      monthMovie[key].push({title: movie.title_th, poster:movie.poster_ori, release:movie.release_date})
    })
    var cells = []
    {(() => {
      for (var month in monthMovie) {
        renderMovie.push(<MovieOfMonth title={month} key={month}/>)
        monthMovie[month].map((movie,i) => {
          let releaseDate = this.formatDate(movie.release)
          cells.push(<MoviePoster title={movie.title} release={releaseDate} poster={movie.poster} key={movie.title+i}/>)
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
