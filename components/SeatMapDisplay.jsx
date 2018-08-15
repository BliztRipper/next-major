import { PureComponent, Fragment } from 'react'

class SeatMapDisplay extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
        areas: this.props.areaData,
        areaSelected: null,
        seatsSelected: [],
        renderSeats: null,
        tickets: this.props.ticketData,
        renderListPrice: null,
        renderListSelectedAndPrice: null,
        postingTicket: false,
        userOrder: '',
        userPhoneNumber: '0863693746',
        userAuthData: null,
        apiOtpHeader: {
          'Accept': 'application/json',
          'X-API-Key': '085c43145ffc4727a483bc78a7dc4aae',
          'Content-Type': 'application/json'
        }
      }
  }
  handleSelectSeats (aSeat, area, row, ticket) {
    if (this.state.seatsSelected.length && this.state.areaSelected !== area.AreaCategoryCode) return false
    // let isOdd = (num) => { return num % 2 === 1 }
    let seatsSelected = this.state.seatsSelected
    this.state.areaSelected = area.AreaCategoryCode
    if (aSeat.Status === 99) {
      aSeat.Status = 0
      seatsSelected = this.state.seatsSelected.filter((element) => { 
        let matchSeatBefore = element.Id === aSeat.Id && element.ticket.AreaCategoryCode === area.AreaCategoryCode && element.rowPhysicalName === row.PhysicalName
        return !matchSeatBefore 
      })
    } else if (aSeat.Status === 0) {
      aSeat.Status = 99
      this.state.seatsSelected.push({
        ...aSeat,
        rowPhysicalName: row.PhysicalName,
        ticket: ticket
      })
    } 
    this.setState({
      seatsSelected: seatsSelected,
      areaSelected: this.state.areaSelected,
      renderSeats: this.listGroups()
    })
  }
  pushDataSeatSelectedToStorage () {
    let dataToStorage = {
      cinemaId: '',
      SessionId: '',
      ticketTypeCode: '',
      qty: 0,
      priceInCents: 0,
      SelectedSeats: []
    }
    this.state.seatsSelected.forEach((item, index, array) => {
      let data = {
        cinemaId: item.ticket.CinemaId,
        priceInCents: item.ticket.PriceInCents,
        ticketTypeCode: item.ticket.TicketTypeCode,
        qty: array.length,
        SessionId: this.props.SessionId
      }
      dataToStorage = {...dataToStorage, ...data}
      dataToStorage.SelectedSeats.push({
        AreaCategoryCode: item.ticket.AreaCategoryCode,
        ...item.Position
      })
    });
    try {
      this.setState({postingTicket: true})
      fetch(`https://api-cinema.truemoney.net/AddTicket`,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then((data) =>  {
        console.log(data, 'data add tickets')
        if (data.status_code !== 400) {
          this.setState({
            postingTicket: false,
            userOrder: data.data.Order
          })
          this.props.handleShowOtp()
        }
      })
    } catch (error) {
      console.error('error', error);
    }
  }
  authOtpHasToken () {
    try {
      this.setState({postingTicket: true})
      fetch(`https://api-cinema.truemoney.net/HasToken/${this.state.userPhoneNumber}`,{
        headers: this.state.apiOtpHeader
      })
      .then(response => response.json())
      .then((data) =>  {
        console.log(data, 'HasToken')
        // if (data.status_code === 200) {
        //   this.setState({postingTicket: false})
        //   alert('มี Token แล้ว ไปหน้าแคชเชียร์')
        // } else {
        // }
        this.authOtpGetOtp()
      })
    } catch (error) {
      console.error('error', error);
    }
  }
  authOtpGetOtp () {
    let dataToStorage = {
      mobile_number: this.state.userPhoneNumber,
      tmn_account: this.state.userPhoneNumber
    }
    try {
      fetch(`https://api-cinema.truemoney.net/AuthApply/${this.state.userPhoneNumber}`,{
        method: 'POST',
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then((data) =>  {
        console.log(data, 'getOTP')
        this.state.userAuthData = {
          phoneNumber: this.state.userPhoneNumber,
          ...data
        }
        this.setState({
          postingTicket: false
        })
        this.props.handleShowOtp(this.state.userAuthData)
      })
    } catch (error) {
      console.error('error', error);
    }
  }
  handleSubmitTicket () {
    if (this.state.postingTicket) return false
    if (this.state.seatsSelected.length) {
      this.authOtpHasToken()
    } else {
      alert('กรุณาเลือกที่นั่ง')
    }
      
  }
  manageDescription (str) {
    let word = 'hair'
    if (str.search(word) >= 0) {
      return str.substring(0, str.indexOf(word) - 1)
    } else {
      return str
    }
  }
  listGroups () {
    return (
      this.state.areas.map(area => {
        let ticket = this.state.tickets.filter(ticket => ticket.AreaCategoryCode === area.AreaCategoryCode)
        ticket = ticket[0]
        let classNameSelected = ''
        let totalSeatsEachRow = 0
        classNameSelected = area.AreaCategoryCode === this.state.areaSelected && this.state.seatsSelected.length ? ' selected' : ''
        
        let listItems = []
        listItems = area.Rows.map((row, rowIndex) => {
          if (row.PhysicalName !== null) {
            totalSeatsEachRow = row.Seats.length
            let seatMapCell = row.Seats.map((aSeat, aSeatIndex) => {
              let classNameCell = 'seatMapDisplay__cell'
              if (aSeat.Status !== 0) {
                if (aSeat.Status === 99) {
                  classNameCell = classNameCell + ' ' + 'selected'
                } else {
                  classNameCell = classNameCell + ' ' + 'notAllowed'
                }
              }
              return (
                <div className={classNameCell} key={area.AreaCategoryCode + row.PhysicalName + aSeatIndex} onClick={this.handleSelectSeats.bind(this, aSeat, area, row, ticket)} >
                  <div>
                    {(aSeat.Id)}
                  </div>
                </div>
              )
            })
            return (
              <Fragment key={'Fragment' + row.PhysicalName + rowIndex}>
                <div className="seatMapDisplay__title" key={area.AreaCategoryCode + row.PhysicalName }>{row.PhysicalName}</div>
                <div className="seatMapDisplay__row" style={ {'--total-seat': totalSeatsEachRow} } key={'row' + area.AreaCategoryCode + row.PhysicalName }>
                  {seatMapCell}
                </div>
              </Fragment>
            )
          }
        })
        return (
          <div className={ 'seatMapDisplay__group ' + classNameSelected} key={area.AreaCategoryCode}>
            {listItems}
          </div>
        )
      })
    )
  }
  listPrice () {
    let ticketList = this.state.tickets.map(element => {
      let classNameTicketList = 'ticketResult__list'
      let Description = this.manageDescription(element.Description)
      return (
        <div className={classNameTicketList} key={element.AreaCategoryCode + Description}>
          <div>
            <div>{Description}</div>
            <div>{(element.PriceInCents / 100) + ' บาท'}</div>
          </div>
        </div>
      )
    });
    return (
      <div className="ticketResult__lists">
        {ticketList}
      </div>
    )
  }
  listSelectedAndPrice () {
    let selectedList = this.state.seatsSelected.map(seat => seat.rowPhysicalName + seat.Id)
    selectedList = selectedList.join()
    let totalPrice = 0
    this.state.seatsSelected.forEach(seat => {
      totalPrice += seat.ticket.PriceInCents / 100
    })
    return (
      <div className="ticketResult__selectedAndPrice">
        <div className="ticketResult__selectedLists">
          {selectedList}
        </div>
        <div className="ticketResult__totalPrice">
        {'รวม ' + totalPrice + ' บาท' }
        </div>
      </div>
    )
  }
  componentWillMount () {
    this.setState({ 
      renderSeats: this.listGroups(),
      renderListPrice: this.listPrice()
    })
  }
  componentDidMount () {
    (()=> {
      let parent = document.querySelector('.seatMap')
      let header = document.querySelector('.globalHeader')
      let footer = document.querySelector('.seatMapFooter')
      parent.style.cssText = `padding-bottom: ${footer.clientHeight}px; padding-top: ${header.clientHeight}px;`
    })()
  }
  render () {
    const {renderSeats, renderListPrice} = this.state
    if (!renderSeats) return false
    let classNameSelected = this.state.seatsSelected.length ? ' selected' : ''
    let buttonText = 'ดำเนินการ'
    if (this.state.postingTicket) {
      buttonText = 'กรุณารอสักครู่'
      classNameSelected = classNameSelected + ' posting'
    }
    return (
      <Fragment>
        <div className="seatMapMain">
          <div className="seatMapMain__inner">
            <div className="seatMapScreen"><div className="seatMapScreen__inner"></div></div>
            <div className={'seatMapDisplay' + classNameSelected}>
              {renderSeats}
            </div>
          </div>
        </div>
        <div className="seatMapFooter">
          <div className={'ticketResult' + classNameSelected}>
            {renderListPrice}
            {this.listSelectedAndPrice()}
          </div> 
          <div className={'seatMapSubmit' + classNameSelected} onClick={this.handleSubmitTicket.bind(this)}>
            <div>{buttonText}</div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default SeatMapDisplay;