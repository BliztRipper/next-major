import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'
import '../styles/style.scss'

class MovieInfoComp extends PureComponent {
    render() {
      if (this.props.item) {
        return (
          <Fragment>
            <div className="movie-card__container">
              <img className="movie-card__poster" src={this.props.item.poster_ori} />
              <div className="movie-card__wrapper">
                <h2 className="movie-card__title">{this.props.item.title_en}</h2>
                <h3 className="movie-card__subtitle">{this.props.item.title_th}</h3>
                <span className="movie-card__genre">{this.props.item.genre} | {this.props.item.duration} นาที</span>
                <Link prefetch href='/MovieInfo'>
                  <a className="movie-card__more-detail">ดูรายละเอียดเพิ่ม</a>
                </Link>
              </div>
            </div>
          </Fragment>
        )
      }

      return (
        <Fragment></Fragment>
      )
    }
  }

  export default MovieInfoComp;