import { PureComponent } from 'react';
import '../styles/style.scss'
import Layout from '../components/Layout'
import Ticket from '../components/Ticket'
import Swal from 'sweetalert2'
import loading from '../static/loading.svg'
import Router from 'next/router'
import utilities from '../scripts/utilities'
import GlobalHeader from '../components/GlobalHeader'

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
        return_url: 'https://api-cinema.truemoney.net/CompleteOrder',
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
      VistaBookingNumber:'',
      movieSelected: ''
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
        let dataToHome = {
          pathname: '/',
          query: {
            accid: this.props.accid
          }
        }

        if(data.description === 'Success'){
          sessionStorage.removeItem('movieSelect')
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
        } else {
          Swal({
            type: 'error',
            title: 'เกิดข้อผิดพลาด!',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'กลับไปหน้าแรก',
            text: 'data.description',
            onAfterClose: () => { this.goToHome() }
          })
        }
      })

    } catch (error) {
      console.error('error', error);
    }
  }
  componentDidMount() {

    this.state.movieSelected = JSON.parse(sessionStorage.getItem('movieSelect'))

    try {
      let dateObj = new Date(sessionStorage.getItem('BookingDate'));
      let month = dateObj.getUTCMonth() + 1
      let day = dateObj.getUTCDate()
      let year = dateObj.getUTCFullYear()
      let monthFormated = this.formatMonth(month)
      let bookingDate = day + " " + monthFormated

      this.setState({
        BookingMovie: String(this.state.movieSelected.title_en),
        BookingMovieTH: String(this.state.movieSelected.title_th),
        BookingDuration: String(this.state.movieSelected.duration),
        BookingGenre: String(this.state.movieSelected.genre),
        BookingPoster: String(this.state.movieSelected.poster_ori),
        BookingCinema: String(sessionStorage.getItem('BookingCinema')),
        BookingScreenName: String(sessionStorage.getItem('BookingScreenName')),
        BookingSeat: String(sessionStorage.getItem('BookingSeat')),
        BookingDate: String(bookingDate),
        BookingAttributesNames: String(sessionStorage.getItem('BookingAttributesNames')),
        BookingTime: String(sessionStorage.getItem('BookingTime')),
        BookingPrice: String(sessionStorage.getItem('BookingPrice')),
        BookingPriceDisplay: String(sessionStorage.getItem('BookingPriceDisplay')),
        BookingUserSessionId: String(sessionStorage.getItem('BookingUserSessionId')),
        BookingUserPhoneNumber: String(sessionStorage.getItem('BookingUserPhoneNumber')),
        BookingCurrentServerTime: String(sessionStorage.getItem('BookingCurrentServerTime'))

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

  formatMonth(month) {
    var monthNames = [
      "", "ม.ค.", "ก.พ.", "มี.ค.",
      "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.",
      "ส.ค.", "ก.ย.", "ค.ค.",
      "พฤ.ย.", "ธ.ค."
    ]
    return monthNames[month]
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
        <div className="globalContent isCashier">
          <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="ยืนยันที่นั่ง"></GlobalHeader>
          <div className="globalBody">
            <div className="globalBodyInner">
              <Ticket ref={this.refTicket} dataTicket={dataToTicket} accid={this.props.url.query.accid} submitPayment={this.submitPayment.bind(this)}></Ticket>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}




export default Cashier;
