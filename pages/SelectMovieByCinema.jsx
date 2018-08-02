import React, { PureComponent } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link'
import loading from '../static/loading.gif'


class MainSelectMovieByCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      error: null,
    }
  }

  // componentDidMount() {
    
  // }
  

  render() {
    // const {data, isLoading, error} = this.state;
    // if (error) {
    //   return <p>{error.message}</p>;
    // }
    // if (isLoading) { 
    //   return <img src={loading} className="loading"/>
    // }
    return (
      <Layout title="Select Movie">
        <article className="movie-card">
          <div className="movie-card__container">
            <img className="movie-card__poster" src="static/Group.png" />
            <div className="movie-card__wrapper">
              <h2 className="movie-card__title">The Hitman's Bodyguard</h2>
              <h3 className="movie-card__subtitle">แสบ ซ่าส์ แบบว่าบอดี้การ์ด</h3>
              <span className="movie-card__genre">Action/Comedy | 118 นาที</span>
              <Link prefetch href="">
                <a className="movie-card__more-detail">รายละเอียด</a>
              </Link>
            </div>
          </div>
          <div className="movie-card__theatre-container">
            <div className="movie-card__theatre-wrapper">
              <div className="movie-card__theatre-title">Theatre 5</div>
              <img className="movie-card__theatre-type" src='static/digital.png'/>
              <span>ไทย</span>
            </div>
            <div className="movie-card__timetable">
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
              <Link prefetch href="">
                <a className="movie-card__showtime">15:00</a>
              </Link>
            </div>
          </div>
        </article>
      </Layout>
    );
  }
}

export default MainSelectMovieByCinema;

