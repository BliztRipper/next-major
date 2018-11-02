import React, { PureComponent } from 'react';
import Link from 'next/link'

class MoviePoster extends PureComponent {
  movieProps(){
    let item = JSON.stringify(this.props.item)
    sessionStorage.setItem('movieSelect',item)
  }
  render() {
    return (
        <div className='comingsoon__cell' onClick={this.movieProps.bind(this)}>
          <Link prefetch href='/MovieInfo' key="desc-movie-info">
            <div style={{display:'flex',flexDirection:'column'}}>
              <img className='comingsoon__poster' src={this.props.poster}/>
              <span className='comingsoon__title'>{this.props.title_th}</span>
              <span className='comingsoon__date'>{this.props.release}</span>
            </div>
          </Link>
        </div>
    );
  }
}

export default MoviePoster;