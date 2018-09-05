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
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const d = new Date(dateString);
    return monthNames[d.getMonth()]+' '+d.getFullYear()
  }

  render() {
    const {dataObj, monthMovie, renderMovie} = this.state;
    
    dataObj.comingsoon.map(movie => {
      let key = this.convertToYearMonth(movie.release_date)
      if (key in monthMovie == false){
        monthMovie[key] = []
      } 
      monthMovie[key].push({title: movie.title_th, poster:movie.poster_ori})
    })
    
    var cells = []
    {(() => {
      for (var month in monthMovie) {
        renderMovie.push(<MovieOfMonth title={month} key={month}/>)
        monthMovie[month].map((movie,i) => {
          cells.push(<MoviePoster title={movie.title} poster={movie.poster} key={movie.title+i}/>)
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
