import React, { PureComponent } from 'react';

class CinemaMovieInfo extends PureComponent {
  render() {
    return (
      <div className="movie-card__container">
        <img className="movie-card__poster" src={this.props.poster} />
        <div className="movie-card__wrapper">
          <h2 className="movie-card__title">{this.props.title_en}</h2>
          <h3 className="movie-card__subtitle">{this.props.title_th}</h3>
          <span className="movie-card__genre">{this.props.genre} | {this.props.duration}</span>
          <Link prefetch href="">
            <a className="movie-card__more-detail">รายละเอียด</a>
          </Link>
        </div>
      </div>
    );
  }
}

export default CinemaMovieInfo
