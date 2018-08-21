import { PureComponent, Fragment } from 'react';
import '../styles/cashier.scss'
import QRCode from 'qrcode.react'
import Link from 'next/link'

class Ticket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      postingTicket: false,
      success: false,
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
      BookingPriceDisplay: '',
      BookingUserSessionId: '',
      BookingUserPhoneNumber: '',
      VistaBookingId:'',
      VistaBookingNumber:''
    }
  }
  componentWillMount() {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; 
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let newdate = day + "/" + month + "/" + year;
    Object.keys(this.props.dataTicket).forEach(key => this.state[key] = this.props.dataTicket[key])
    this.setState({
      ...this.props.dataTicket,
      BookingDate: newdate,
      success: this.props.dataTicket.VistaBookingId ? true : false
    })
  }
  renderCinemaMovieInfo () {
    const {success, postingTicket} = this.state;     
    let buttonProgressText = 'ดำเนินการ'
    let buttonProgressClassName = success? 'movie-cashier__confirm success':'movie-cashier__confirm'
    buttonProgressClassName += postingTicket? ' posting' : ''
    if (postingTicket) {
      buttonProgressText = 'กรุณารอสักครู่'
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
            <span className="movie-cashier__seat-info--title">ราคา {this.state.BookingPriceDisplay} บาท</span>
          </div>
        </div>
        <div className={success? 'qrContainer success':'qrContainer'}>
          <div className="qrContainer__qrcode">
            <QRCode size={150} level={"H"} value={this.state.VistaBookingNumber} />
          </div>
          <b className="qrContainer__ref">{this.state.VistaBookingId}</b>
        </div>
        <div className={buttonProgressClassName} onClick={this.props.submitPayment}>{buttonProgressText}</div>
        <Link prefetch href="/">
          <div className={success? 'movie-cashier__confirm':'movie-cashier__confirm success'}>เสร็จสิ้น</div>
        </Link>  
      </div>
    );    
  }
  render() {
    return (
      <Fragment>
        {this.renderCinemaMovieInfo()}
      </Fragment>
    );
  }
}




export default Ticket;
