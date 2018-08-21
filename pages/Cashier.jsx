import { PureComponent } from 'react';
import Layout from '../components/Layout'
import Ticket from '../components/Ticket'
import loading from '../static/loading.gif'

class Cashier extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      postingTicket: false,
      dataToPayment: {
        third_party_tx_id: '',
        amount_satang: 0,
        currency: 'THB',
        payload: {}
      },
      dataToTicket: '',
      apiOtpHeader: {
        'Accept': 'application/json',
        'X-API-Key': '085c43145ffc4727a483bc78a7dc4aae',
        'Content-Type': 'application/json'
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
      success: false, 
      VistaBookingId:'',
      VistaBookingNumber:''
    }
  }
  submitPayment () {
    if (this.state.postingTicket) return false
    this.setState({postingTicket: true})
    console.log(this.state.dataToPayment, 'data POST submitPayment')
    try {
      fetch(`https://api-cinema.truemoney.net/Payment/${this.state.BookingUserPhoneNumber}`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(this.state.dataToPayment)
      })
      .then(response => response.json())
      .then((data) =>  {
        console.log(data, 'data RESPONSE submitPayment')
        if(data.status_code == 200){
          this.setState({
            postingTicket: false,
            success: true,
            VistaBookingId:data.data.data.VistaBookingId,
            VistaBookingNumber:data.data.data.VistaBookingNumber,
          })
        } 
      })

    } catch (error) {
      console.error('error', error);
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
        BookingPriceDisplay: sessionStorage.getItem('BookingPriceDisplay'),
        BookingUserSessionId: sessionStorage.getItem('BookingUserSessionId'),
        BookingUserPhoneNumber: sessionStorage.getItem('BookingUserPhoneNumber')
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
        <Ticket dataTicket={dataToTicket} submitPayment={this.submitPayment.bind(this)}></Ticket>
      </Layout>
    );
  }
}




export default Cashier;
