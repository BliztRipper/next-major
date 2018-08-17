import React, { PureComponent, Fragment } from 'react';
import Layout from '../components/Layout'
import loading from '../static/loading.gif'
import '../styles/cashier.scss'

class CinemaMovieInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      dataToPayment: {
        third_party_tx_id: '',
        amount_satang: 0,
        currency: 'THB',
        payload: {}
      },
      BookingMovie: '',
      BookingDuration: '',
      BookingGenre: '',
      BookingCinema: '',
      BookingMovieTH: '',
      BookingPoster: '',
      BookingScreenName: '',
      BookingSeat: '',
      BookingDate: '',
      BookingAttributesNames: '',
      BookingTime: '',
      BookingPrice: '',
      BookingUserSessionId: '',
      success: false
    }
  }
  componentDidMount() {
    try {
      let dateObj = new Date();
      let month = dateObj.getUTCMonth() + 1; 
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let newdate = day + "/" + month + "/" + year;
      this.setState({
        BookingMovie: sessionStorage.getItem('BookingMovie'),
        BookingDuration: sessionStorage.getItem('BookingDuration'),
        BookingGenre: sessionStorage.getItem('BookingGenre'),
        BookingCinema: sessionStorage.getItem('BookingCinema'),
        BookingMovieTH: sessionStorage.getItem('BookingMovieTH'),
        BookingPoster: sessionStorage.getItem('BookingPoster'),
        BookingScreenName: sessionStorage.getItem('BookingScreenName'),
        BookingSeat: sessionStorage.getItem('BookingSeat'),
        BookingDate: newdate,
        BookingAttributesNames: sessionStorage.getItem('BookingAttributesNames'),
        BookingTime: sessionStorage.getItem('BookingTime'),
        BookingPrice: sessionStorage.getItem('BookingPrice'),
        BookingUserSessionId: sessionStorage.getItem('BookingUserSessionId'),
        isLoading: false
      },
        () => {
          let filterPattern = 'Booking'
          let filtered = Object.keys(this.state).filter((str) => str.includes(filterPattern))
          filtered.forEach(key => { this.state.dataToPayment.payload[key] = this.state[key] })
          this.state.dataToPayment.third_party_tx_id = this.state.BookingUserSessionId
          this.state.dataToPayment.amount_satang = this.state.BookingPrice
          console.log(this.state.dataToPayment , 'this.state.dataToPayment')
        }
      )
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }
  
  render() {
    const {isLoading, error,success} = this.state;      
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    } 
   
    return (
      <div className="movie-cashier__container">
        <div className="movie-cashier__movie-info">
          <img className="movie-cashier__poster" src={this.state.BookingPoster}/>
          <div className="movie-cashier__wrapper">
            <h2 className="movie-cashier__title">{this.state.BookingMovie}</h2>
            <h3 className="movie-cashier__subtitle">{this.state.BookingMovieTH}</h3>
            <span className="movie-cashier__genre">{this.state.BookingGenre}<br/> {this.state.BookingDuration}</span>
          </div>
        </div>
        <div className="movie-cashier__cine-info">
            <span className="movie-cashier__cine-info--title">{this.state.BookingCinema}</span>
            <span className="movie-cashier__cine-info--label">สาขา</span>
            <span className="movie-cashier__cine-info--map">ดูแผนที่</span>
        </div>
        <div className="movie-cashier__date-info">
          <div className="movie-cashier__date-info--wrapper">
            <span className="movie-cashier__date-info--label">วันที่</span>
            <span className="movie-cashier__date-info--title">{this.state.BookingDate}</span>
          </div>
          <div className="movie-cashier__date-info--wrapper">
            <span className="movie-cashier__date-info--label">เวลา</span>
            <span className="movie-cashier__date-info--title">{this.state.BookingTime}</span>
          </div>
        </div>
        <div className="movie-cashier__seat-info">
          <div className="movie-cashier__seat-info--wrapper">
            <span className="movie-cashier__seat-info--label">โรงภาพยนตร์</span>
            <span className="movie-cashier__seat-info--title">{this.state.BookingScreenName}</span>
          </div>
          <div className="movie-cashier__seat-info--wrapper">
            <span className="movie-cashier__seat-info--label">หมายเลขที่นั่ง</span>
            <span className="movie-cashier__seat-info--title">{this.state.BookingSeat}</span>
          </div>
        </div>
        <div className="movie-cashier__seat-info">
          <div className="movie-cashier__seat-info--wrapper">
            <span className="movie-cashier__seat-info--title">เสียง {this.state.BookingAttributesNames}</span>
          </div>
          <div className="movie-cashier__seat-info--wrapper">
            <span className="movie-cashier__seat-info--title">ราคา {this.state.BookingPrice} บาท</span>
          </div>
        </div>
        <div className={success? 'qrContainer success':'qrContainer'}>
          <img className="qrContainer__qrcode" src="../static/QR.png"/>
          <b className="qrContainer__ref">WJM28PZ</b>
        </div>
        <div className={success? 'movie-cashier__confirm success':'movie-cashier__confirm'}>ยืนยันการจอง</div>
        <div className={success? 'movie-cashier__confirm':'movie-cashier__confirm success'}>เสร็จสิ้น</div>
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
      </Layout>
    );
  }
}




export default Cashier;
