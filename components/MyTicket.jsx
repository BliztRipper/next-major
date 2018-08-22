import {PureComponent, Fragment} from 'react'
import Ticket from './Ticket'
import loading from '../static/loading.gif'

class MyTicket extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      error: null,
      userPhoneNumber: '0891916415',
      dataMyTicket: {},
    }
    this.refTicket = React.createRef()
  }
  getTickets () {
    try{
      fetch(`https://api-cinema.truemoney.net/MyTickets/${this.state.userPhoneNumber}`)
      .then(response => response.json())
      .then(data => {
        console.log(data, 'data RESPONSE MyTickets')
        this.setState({ 
          dataMyTicket: data.data,
          isLoading: false 
        })
      })
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }    
  }
  renderTickets () {
    return (
      this.state.dataMyTicket.map((item) => {
        return (
          <Ticket ref={this.refTicket} dataTicket={item} key={item.VistaBookingId}></Ticket>
        )
      })
    )
  }
  componentWillMount() {
    this.getTickets()
  }
  render () {
    const {isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    return (
      <Fragment>
        <header className="cashier-header">ตั๋วของฉัน</header>
        {this.renderTickets()}
      </Fragment>
    )
  }
}
export default MyTicket;