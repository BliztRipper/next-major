import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'
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
      const imageWrap = {
        height:'35vh',
        position:'relative',
      }
      const poster = {
        width:'100%',
        left: 0,
        right: 0,
        zIndex: -1,
        position: 'absolute',
        filter: 'brightness(0.4)',
        height: 'auto',
      }
      const wrapper ={
        marginLeft:0,
        heigth:'auto',
        height: '8vh'
      }
      const detail ={
        backgroundColor: '#989fae',
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
          <div style={imageWrap}>
            <img className="movie-card__poster" src={this.movieImage(this.props.item.movie_image)} style={poster}/>
          </div>
          <div className="movie-card__container">
            <div className="movie-card__wrapper" style={wrapper}>
              <h2 className="movie-card__title" style={title}>{this.props.item.title_en}</h2>
              <h3 className="movie-card__subtitle" style={subtitle}>{this.props.item.title_th}</h3>
              <div className="movie-card__genre" style={genre}>{this.props.item.genre} | {this.props.item.duration} นาที</div>
              <Link prefetch href='/MovieInfo'>
                <a className="movie-card__more-detail" style={detail}>รายละเอียด</a>
              </Link>
            </div>
          </div>
        </Fragment>
      )
    }
  }

  export default MovieInfoComp;