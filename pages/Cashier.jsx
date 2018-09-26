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
      BookingBranchLocation: '',
      BookingMovieTH: '',
      BookingPoster: '',
      BookingScreenName: '',
      BookingSeat: '',
      BookingDate: '',
      BookingFullDate: '',
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
      movieSelected: '',
      userInfo: ''
    }
    this.refTicket = React.createRef()
  }
  submitPayment () {
    if (this.refTicket.current.postingTicket) return false
    this.refTicket.current.setState({postingTicket: true})
    console.log(this.state.dataToPayment, 'this.state.dataToPayment')
    try {
      fetch(`https://api-cinema.truemoney.net/Payment/${this.state.userInfo.accid}/${this.state.userInfo.mobileno}`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(this.state.dataToPayment)
      })
      .then(response => response.json())
      .then((data) =>  {
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
          this.refTicket.current.setState({postingTicket: false})

          Swal({
            type: 'error',
            title: 'เกิดข้อผิดพลาด!',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'กลับไปหน้าแรก',
            text: data.description,
            onAfterClose: () => {
              Router.push({ pathname: '/' })
            }
          })
          fetch(`http://api-cinema.truemoney.net/CancelOrder`,{
            method: 'POST',
            headers: this.state.apiOtpHeader,
            body: JSON.stringify({'UserSessionId': this.state.BookingUserSessionId})
          })
          .then(response => response.json())
          .then((data) =>  {
            console.log(data, 'data RESPONSE CancelOrder')
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
      let instantFullDate = new Date(sessionStorage.getItem('BookingDate'));
      let month = instantFullDate.getUTCMonth() + 1
      let day = instantFullDate.getUTCDate()
      let year = instantFullDate.getUTCFullYear()
      let monthFormated = this.formatMonth(month)
      let bookingDate = day + " " + monthFormated
      this.state.BookingFullDate = `${day}/${month}/${year}`

      this.setState({
        BookingMovie: String(this.state.movieSelected.title_en),
        BookingMovieTH: String(this.state.movieSelected.title_th),
        BookingDuration: String(this.state.movieSelected.duration),
        BookingGenre: String(this.state.movieSelected.genre),
        BookingPoster: String(this.state.movieSelected.poster_ori),
        BookingCinema: String(sessionStorage.getItem('BookingCinema')),
        BookingBranchLocation: JSON.parse(sessionStorage.getItem('BookingBranchLocation')),
        BookingScreenName: String(sessionStorage.getItem('BookingScreenName')),
        BookingSeat: String(sessionStorage.getItem('BookingSeat')),
        BookingDate: String(bookingDate),
        BookingFullDate: String(this.state.BookingFullDate),
        BookingAttributesNames: String(sessionStorage.getItem('BookingAttributesNames')),
        BookingTime: String(sessionStorage.getItem('BookingTime')),
        BookingPrice: String(sessionStorage.getItem('BookingPrice')),
        BookingPriceDisplay: String(sessionStorage.getItem('BookingPriceDisplay')),
        BookingUserSessionId: String(sessionStorage.getItem('BookingUserSessionId')),
        BookingUserPhoneNumber: String(sessionStorage.getItem('BookingUserPhoneNumber')),
        BookingCurrentServerTime: String(sessionStorage.getItem('BookingCurrentServerTime')),
        userInfo: JSON.parse(sessionStorage.getItem("userInfo"))

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

  render() {
    const {isLoading, error, dataToTicket, userInfo} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    return (
      <Layout title="Cashier Page">
        {(() => {
          if (userInfo) {
            return (
              <div className="globalContent isCashier">
                <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="ยืนยันที่นั่ง"></GlobalHeader>
                <div className="globalBody">
                  <div className="globalBodyInner">
                    <Ticket ref={this.refTicket} dataTicket={dataToTicket} accid={userInfo.accid} submitPayment={this.submitPayment.bind(this)}></Ticket>
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <section className="empty">
                <img src={empty} />
                <h5>ข้อมูลไม่ถูกต้อง</h5>
              </section>
            )
          }
        })()}
      </Layout>
    );
  }
}




export default Cashier;
