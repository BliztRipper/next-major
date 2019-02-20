import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
import '../styles/style.scss'

class MovieInfoComp extends PureComponent {
    movieImage(img){
      if(img === ""){
        img = '../static/empty2.png'
      } else {
        img = img
      }
      return img
    }
    render() {
      const poster = {
        width: '100%',
        height: '40vh',
        left: 0,
        right: 0,
        zIndex: -1,
        position: 'absolute',
        filter: 'brightness(0.4)',
        backgroundColor: '#c3c3c3',
      }
      const wrapper ={
        marginLeft:0,
      }
      const detail ={
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        color: '#fff',
        display: 'block',
        fontSize: '0.875rem',
        marginTop: '1rem',
        padding: '6px 8px',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        width: '100px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }
      const title = {
        position: 'relative',
        fontSize: '1.125rem',
        fontWeight: 700,
        marginBottom: '1rem',
        color:'#fff',
        textAlign: 'center',
      }
      const subtitle = {
        fontSize: '.875rem',
        fontWeight: 700,
        margin: '0',
        color:'#fff',
        textAlign: 'center'
      }
      const genre = {
        fontSize: '.75rem',
        textAlign:'center',
        color:'#fff',
      }
      return (
        <Fragment>
          <div className="movie-card__img-wrap" key="movie-card-img">
            <img src={this.movieImage(this.props.item.movie_image)} style={poster} key="img" />
            <div className="movie-card__img-fade" key="fade"></div>
          </div>
          <div className="movie-card__container" key="movie-card-container">
            <div style={wrapper}>
              <h2 className="movie-card__title" style={{...title, ...{ paddingLeft:'12vw', paddingRight:'12vw' }}} key="title-h2"><GlobalHeaderButtonBack></GlobalHeaderButtonBack> {this.props.item.title_en}</h2>
              <h3 className="movie-card__subtitle" style={subtitle} key="title-h3">{this.props.item.title_th}</h3>
              <div className="movie-card__genre" style={genre} key="desc-genre">{this.props.item.genre} | {this.props.item.duration} นาที</div>
              <Link prefetch href='/MovieInfo' key="desc-movie-info">
                <a className="movie-card__more-detail" style={detail}>รายละเอียด</a>
              </Link>
            </div>
          </div>
        </Fragment>
      )
    }
  }

  export default MovieInfoComp;