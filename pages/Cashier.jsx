import React, { PureComponent, Fragment } from 'react';
import Layout from '../components/Layout'
import loading from '../static/loading.gif'
import '../styles/cashier.scss'

class CinemaMovieInfo extends PureComponent {
  render() {
    return (
      <div className="movie-cashier__container">
        <div className="movie-cashier__movie-info">
          <img className="movie-cashier__poster" src="static/thumb_2183.jpg"/>
          <div className="movie-cashier__wrapper">
            <h2 className="movie-cashier__title">Mission Impossible 6</h2>
            <h3 className="movie-cashier__subtitle">มิชชั่น อิมพอสสิเบิ้ล ฟอลล์เอาท์</h3>
            <span className="movie-cashier__genre">Action/Adventure/Thriller <br/> 118 นาที</span>
          </div>
        </div>
        <div className="movie-cashier__cine-info">
            <span className="movie-cashier__cine-info--title">ควอเทียร์ ซีเนอาร์ต</span>
            <span className="movie-cashier__cine-info--label">สาขา</span>
            <span className="movie-cashier__cine-info--map">ดูแผนที่</span>
        </div>
        <div className="movie-cashier__date-info">
          <div className="movie-cashier__date-info--wrapper">
            <span className="movie-cashier__date-info--label">วันที่</span>
            <span className="movie-cashier__date-info--title">3 ก.ย.</span>
          </div>
          <div className="movie-cashier__date-info--wrapper">
            <span className="movie-cashier__date-info--label">เวลา</span>
            <span className="movie-cashier__date-info--title">19:40</span>
          </div>
        </div>
        <div className="movie-cashier__seat-info">
          <div className="movie-cashier__seat-info--wrapper">
            <span className="movie-cashier__seat-info--label">โรงภาพยนตร์</span>
            <span className="movie-cashier__seat-info--title">3</span>
          </div>
          <div className="movie-cashier__seat-info--wrapper">
            <span className="movie-cashier__seat-info--label">หมายเลขที่นั่ง</span>
            <span className="movie-cashier__seat-info--title">J4,J5,VP1, VP2</span>
          </div>
        </div>
        <span className="movie-cashier__sound">อังกฤษ</span>
      </div>
    );
  }
}

class Cashier extends PureComponent {
  render() {
    return (
      <Layout title="Cashier Page">
        <header className="cashier-header">ยืนยันที่นั่ง</header>
        <CinemaMovieInfo/>
        <div className="movie-cashier__confirm">ยืนยันการจอง</div>
      </Layout>
    );
  }
}




export default Cashier;
