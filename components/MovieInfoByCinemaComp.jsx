import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'
import '../styles/style.scss'

class MovieInfoByCinemaComp extends PureComponent {
    movieImage(img){
      if(img === ""){
        img = '../static/empty2.png'
      } else {
        img = img
      }
      return img
    }

    movieInfo(){
      sessionStorage.setItem('movieSelect', JSON.stringify(this.props.item))
    }
    render() {
      const container = {
        padding: 0,
        position: 'relative',
        display:'flex',
        marginBottom: '1rem',
      }
      const wrapper ={
        marginLeft:'1rem',
        marginRight:'0.4rem',
      }
      const detail ={
        borderRadius: '4px',
        border:'1px solid #989fae',
        color: '#989fae',
        display: 'block',
        fontSize: '0.875rem',
        marginTop: '1rem',
        padding: '3px 0',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        width: '100px',
      }
      const title = {
        fontSize: '1.125rem',
        fontWeight: 700,
        marginBottom: '1rem',
      }
      const subtitle = {
        fontSize: '.875rem',
        fontWeight: 700,
      }
      const genre = {
        fontSize: '.875rem',
        color:'#999',
        fontWeight: 'normal',
      }
      return (
        <Fragment>
          <div style={container}>
            <div className="movie-card__poster-wrapper">
              <img className="movie-card__poster" src={this.props.item.poster_ori}/>
            </div>
            <div style={wrapper}>
              <h2 className="movie-card__title" style={title}>{this.props.item.title_en}</h2>
              <h3 className="movie-card__subtitle" style={subtitle}>{this.props.item.title_th}</h3>
              <div style={genre}>{this.props.item.genre} | {this.props.item.duration} นาที</div>
              <span onClick={this.movieInfo.bind(this)} >
                <Link prefetch href='/MovieInfo'><a className="movie-card__more-detail" style={detail} >รายละเอียด</a></Link>
              </span>
            </div>
          </div>
        </Fragment>
      )
    }
  }

  export default MovieInfoByCinemaComp;