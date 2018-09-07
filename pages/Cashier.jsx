import { PureComponent } from 'react';
import Layout from '../components/Layout'
import Ticket from '../components/Ticket'
import '../styles/cashier.scss'
import Swal from 'sweetalert2'
import loading from '../static/loading.gif'
import Router from 'next/router'
import utilities from '../scripts/utilities'

class Cashier extends PureComponent {
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
      dataToTicket: '',
      apiOtpHeader: {
        'X-API-Key': '085c43145ffc4727a483bc78a7dc4aae'
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
      BookingPriceDisplay: '',
      BookingUserSessionId: '',
      BookingUserPhoneNumber: '',
      BookingCurrentServerTime: '',
      success: false, 
      VistaBookingId:'',
      VistaBookingNumber:''
    }
    this.refTicket = React.createRef()
  }
  submitPayment () {
    if (this.refTicket.current.postingTicket) return false
    this.refTicket.current.setState({postingTicket: true})
    try {
      fetch(`https://api-cinema.truemoney.net/Payment/${this.state.BookingUserPhoneNumber}`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(this.state.dataToPayment)
      })
      .then(response => response.json())
      .then((data) =>  {
        if(data.status_code === 0 || data.description === 'Success'){
          let dataPaymentSuccess = {
            success: true,
            VistaBookingId:data.data.data.VistaBookingId,
            VistaBookingNumber:data.data.data.VistaBookingNumber,
          }
          this.setState({...dataPaymentSuccess})
          this.refTicket.current.setState({postingTicket: false, ...dataPaymentSuccess})
          utilities.removeBookingInfoInSessionStorage()
          Swal({
            type: 'success',
            title: 'ทำรายการเสร็จสิ้น!',
            text: 'ขอให้สนุกกับการชมภาพยนต์',
            showConfirmButton: false,
            timer: 4000
          })
        } else if(data.status_code == 400 && data.description === 'Invalid parameters'){
          Swal({
            type: 'error',
            title: 'เกิดข้อผิดพลาด!',
            html: 'ไม่สามารถชำระเงินได้<br/>ที่นั่งที่คุณเลือกอาจถูกซื้อไปแล้ว',
            showConfirmButton: false,
            footer: '<a href="/" style="text-decoration:none;color: #595959;">กลับไปหน้าแรก</a>'
          })
        }
      })

    } catch (error) {
      console.error('error', error);
    }
  }
  componentDidMount() {
    try {
      let dateObj = new Date(sessionStorage.getItem('BookingDate'));
      let month = dateObj.getUTCMonth() + 1; 
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();
      let bookingDate = day + "/" + month + "/" + year;
      this.setState({
        BookingMovie: sessionStorage.getItem('BookingMovie'),
        BookingDuration: sessionStorage.getItem('BookingDuration'),
        BookingGenre: sessionStorage.getItem('BookingGenre'),
        BookingCinema: sessionStorage.getItem('BookingCinema'),
        BookingMovieTH: sessionStorage.getItem('BookingMovieTH'),
        BookingPoster: sessionStorage.getItem('BookingPoster'),
        BookingScreenName: sessionStorage.getItem('BookingScreenName'),
        BookingSeat: sessionStorage.getItem('BookingSeat'),
        BookingDate: bookingDate,
        BookingAttributesNames: sessionStorage.getItem('BookingAttributesNames'),
        BookingTime: sessionStorage.getItem('BookingTime'),
        BookingPrice: sessionStorage.getItem('BookingPrice'),
        BookingPriceDisplay: sessionStorage.getItem('BookingPriceDisplay'),
        BookingUserSessionId: sessionStorage.getItem('BookingUserSessionId'),
        BookingUserPhoneNumber: sessionStorage.getItem('BookingUserPhoneNumber'),
        BookingCurrentServerTime: sessionStorage.getItem('BookingCurrentServerTime')
      },
        () => {
          let filterPattern = 'Booking'
          let filtered = Object.keys(this.state).filter((str) => str.startsWith(filterPattern))
          filtered.forEach(key => { this.state.dataToPayment.payload[key] = this.state[key] })
          this.state.dataToPayment.third_party_tx_id = this.state.BookingUserSessionId
          this.state.dataToPayment.amount_satang = this.state.BookingPrice
          this.setState({
            dataToTicket: this.state.dataToPayment.payload,
            isLoading: false
          })
        })
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }
  goToHome() {
    Router.push({
      pathname: '/',
      query: {
        accid: this.props.url.query.accid
      }
    })
  }

  render() {
    const {isLoading, error, dataToTicket} = this.state;    
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    } 
    return (
      <Layout title="Cashier Page">
        <header className="cashier-header">ยืนยันที่นั่ง</header>
        <Ticket ref={this.refTicket} dataTicket={dataToTicket} submitPayment={this.submitPayment.bind(this)}></Ticket>
      </Layout>
    );
  }
}




export default Cashier;
