import { PureComponent } from 'react';
import '../styles/style.scss'
import Layout from '../components/Layout'
import Ticket from '../components/Ticket'
import Swal from 'sweetalert2'
import loading from '../static/loading.svg'
import Router from 'next/router'
import utilities from '../scripts/utilities'
import GlobalHeader from '../components/GlobalHeader'
import axios from 'axios'

class Cashier extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      dataToPayment: {
        tmn_id: '',
        mobile_no: '',
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
    try {
      axios(`https://api-cinema.truemoney.net/Payment`,{
        method: 'post',
        headers: this.state.apiOtpHeader,
        data: JSON.stringify(this.state.dataToPayment)
      })
      .then((data) =>  {
        if (data.data.data.status_code === 0 || data.data.data.description === 'Success'){
          sessionStorage.removeItem('movieSelect')
          let dataPaymentSuccess = {
            success: true,
            VistaBookingId: data.data.data.data.VistaBookingId,
            VistaBookingNumber: data.data.data.data.VistaBookingNumber,
          }
          this.setState({...dataPaymentSuccess})
          this.refTicket.current.setState({postingTicket: false, ...dataPaymentSuccess})
          utilities.removeBookingInfoInSessionStorage()
          Router.beforePopState(({ url, as, options }) => {
            return false
          })
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
            cancelButtonText: 'ปิด',
            text: `${data.data.data.description} (code:${data.data.data.status_code})` ,
            onAfterClose: () => {
              Router.back()
            }
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
        BookingCinemaOperatorCode: String(sessionStorage.getItem('BookingCinemaOperatorCode')),
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
          this.state.dataToPayment.tmn_id = this.state.userInfo.accid
          this.state.dataToPayment.mobile_no = this.state.userInfo.mobileno
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
      "ส.ค.", "ก.ย.", "ต.ค.",
      "พฤ.ย.", "ธ.ค."
    ]
    return monthNames[month]
  }

  render() {
    const {isLoading, error, dataToTicket, userInfo, success} = this.state;
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    return (
      <Layout title="Cashier Page">
        {(() => {
          if (userInfo) {
            return (
              <div className="globalContent isCashier">
                <GlobalHeader hideBtnBack={success}>{success? 'ซื้อตั๋วสำเร็จ' : 'ยืนยันที่นั่ง'}</GlobalHeader>
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
