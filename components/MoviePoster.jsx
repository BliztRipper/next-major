import React, { PureComponent } from 'react';

class MoviePoster extends PureComponent {
  render() {
    return (
        <div className='comingsoon__cell'>
          <img className='comingsoon__poster' src={this.props.poster}/>
          <span className='comingsoon__title'>{this.props.title}</span>  
          <span className='comingsoon__date'>{this.props.release}</span> 
        </div>
    );
  }
}

export default MoviePoster; 