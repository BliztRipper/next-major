import {PureComponent, Fragment} from 'react'
import Ticket from './Ticket'
import loading from '../static/loading.gif'
import empty from '../static/emptyTicket.png'

class MyTicket extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      error: null,
      userPhoneNumber: '0891916415',
      dataMyTicket: {},
      isEmpty:true,
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
      if(this.state.dataMyTicket.length <= 0){
        this.setState({isEmpty:true})
      }
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }    
  }
  renderTickets () {
    if( this.state.dataMyTicket != null){
      this.state.dataMyTicket.map((item) => {
        return (
          <Ticket ref={this.refTicket} dataTicket={item} key={item.VistaBookingId}></Ticket>
        )
      })
    }
  }
  componentWillMount() {
    this.getTickets()
  }
  render () {
    const {isLoading, error,isEmpty} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><h5>ท่านยังไม่มีตั๋วภาพยนตร์ กรุณาทำการจองตั๋ว</h5></section>
    }   
    return (
      <div className="myTickets">
        <header className="cashier-header">ตั๋วของฉัน</header>
        {this.renderTickets()}
      </div>
    )
  }
}
export default MyTicket;