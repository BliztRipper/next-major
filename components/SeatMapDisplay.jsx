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
        selectedList:'',
        seatColMax: 0,
        seatRowMax: 0,
        seatMatrix: []
      }
      this.refSeatsRow = React.createRef()
      this.refSeatsMainInner = React.createRef()
      this.refSeatsMain = React.createRef()
  }
  getTicketByAreaCode (AreaCategoryCode) {
    return this.state.tickets.filter(ticket => ticket.AreaCategoryCode === AreaCategoryCode)
  }
  getAreaByAreaCode (AreaCategoryCode) {
    return this.state.areas.filter(area => area.AreaCategoryCode === AreaCategoryCode)
  }
  handleSelectSeats (aSeat) {
    let area = this.getAreaByAreaCode(aSeat.AreaCategoryCode)[0]
    let selectRow = this.state.seatMatrix[aSeat.Position.RowIndex]
    let ticket = this.getTicketByAreaCode(aSeat.AreaCategoryCode)[0]
    if (this.state.seatsSelected.length && this.state.areaSelected !== aSeat.AreaCategoryCode) return false
    this.state.areaSelected = aSeat.AreaCategoryCode
    let canBook = (column) => {
      if (column < 0) { //out of bound
        return false
      } else if (column > (selectRow.length - 1)) { //out of bound
        return false
      } else if (selectRow[column] == null) { //not seat in index
        return false
      }
      return (selectRow[column].Status === 0)
    }
    
    let toggleBooked = (aSeat, ticketIsPackageTicket) => {
      if (aSeat.Status === 99) { // Already booked a seat
        aSeat.Status = 0
        this.state.seatsSelected = this.state.seatsSelected.filter((aSeatSelected) => {
          return !(aSeatSelected.Id === aSeat.Id && aSeatSelected.rowPhysicalName === area.PhysicalName)
        })
      } else if (aSeat.Status === 0) { // Allow book a seat
        let allowBook = false
        let bookingStatus = aSeat.OriginalStatus
        let cannotBookLeft = canBook(aSeat.Position.ColumnIndex-1) && !canBook(aSeat.Position.ColumnIndex-2)
        let cannotBookRight = canBook(aSeat.Position.ColumnIndex+1) && !canBook(aSeat.Position.ColumnIndex+2)
        if ((!cannotBookLeft && !cannotBookRight) || ticketIsPackageTicket) {
          allowBook = true
          bookingStatus = 99
        }
        if (allowBook) {
          aSeat.Status = bookingStatus
          this.state.seatsSelected.push({
            ...aSeat,
            rowPhysicalName: area.PhysicalName,
            ticket: ticket
          })
          this.setState({
            seatsSelected: this.state.seatsSelected
          })
        }
      }
    }
    if (ticket.IsPackageTicket) {
      aSeat.SeatsInGroup.forEach(seatInGroup => {
        selectRow.forEach((aSeatInSelectRow) => {
          if (seatInGroup.ColumnIndex === aSeatInSelectRow.Position.ColumnIndex) {
            toggleBooked(aSeatInSelectRow, true)
          }
        })
      })
    } else {
      toggleBooked(aSeat, false)      
    }
    
    this.setState({
      seatsSelected: this.state.seatsSelected,
      areaSelected: this.state.areaSelected,
      renderSeats: this.listGroups()
    })
  }
  handleSubmitTicket () {
    if (this.state.postingTicket) return false
    if (this.state.seatsSelected.length) {
      this.props.authOtpHasToken(this.state.seatsSelected)
      sessionStorage.setItem('BookingSeat',this.state.selectedList)
      sessionStorage.setItem('BookingSeatTotal',this.state.seatsSelected.length)
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
      <div className="seatMapDisplay" style={ {'--row-seat': this.state.seatRowMax} }>
      {
        this.state.seatMatrix.map(rows => {
          let seatMapCell = rows.map((aSeat, aSeatIndex) => {
            let classNameCell = 'seatMapDisplay__cell'
            if (aSeat.Status !== 0) {
              if (aSeat.Status === 99) {
                classNameCell = classNameCell + ' ' + 'selected'
              } else {
                classNameCell = classNameCell + ' ' + 'notAllowed'
              }
            }
            return (
              <div className={classNameCell} style={ {'--col-seat': aSeat.Position.ColumnIndex} } onClick={this.handleSelectSeats.bind(this, aSeat, rows)} >
                <div>{(aSeatIndex)}</div>
              </div>
            )
          })
          return (
            <div className="seatMapDisplay__row" ref={this.refSeatsRow} style={ {'--total-seat': this.state.seatColMax} } > 
              {seatMapCell}
            </div>
          )
        })
      }
      </div>
    )

    // return (
    //   this.state.areas.map(area => {
        
    //     let ticket = this.state.tickets.filter(ticket => { if (ticket) return ticket.AreaCategoryCode === area.AreaCategoryCode })
    //     ticket = ticket[0]
    //     let classNameSelected = ''
    //     let totalSeatsEachRow = area.ColumnCount - 1
    //     classNameSelected = area.AreaCategoryCode === this.state.areaSelected && this.state.seatsSelected.length ? ' selected' : ''
    //     let listItems = area.Rows.slice().reverse().map((row, rowIndex) => {
    //       if (row.PhysicalName !== null) {
    //         let seatMapCell = row.Seats.map((aSeat, aSeatIndex) => {
    //           let classNameCell = 'seatMapDisplay__cell'
    //           if (aSeat.Status !== 0) {
    //             if (aSeat.Status === 99) {
    //               classNameCell = classNameCell + ' ' + 'selected'
    //             } else {
    //               classNameCell = classNameCell + ' ' + 'notAllowed'
    //             }
    //           }
    //           return (
    //             <div className={classNameCell} style={ {'--col-seat': aSeat.Position.ColumnIndex} } key={area.AreaCategoryCode + row.PhysicalName + aSeatIndex} onClick={this.handleSelectSeats.bind(this, aSeat, area, row, ticket)} >
    //               <div>{(aSeat.Id)}</div>
    //             </div>
    //           )
    //         })
    //         return (
    //           <Fragment key={'Fragment' + row.PhysicalName + rowIndex}>
    //             <div className="seatMapDisplay__title"  key={area.AreaCategoryCode + row.PhysicalName }><div>{row.PhysicalName}</div></div>
    //             <div className="seatMapDisplay__row" ref={this.refSeatsRow} style={ {'--total-seat': totalSeatsEachRow} } key={'row' + area.AreaCategoryCode + row.PhysicalName }>
    //               {seatMapCell}
    //             </div>
    //           </Fragment>
    //         )
    //       }
    //     })
    //     if (ticket) {
    //       return (
    //         <div className={ 'seatMapDisplay__group ' + classNameSelected} key={area.AreaCategoryCode}>
    //           {listItems}
    //         </div>
    //       )
    //     }
    //   })
    // )
  }
  listPrice () {
    let ticketList = this.state.tickets.map(ticket => {
      let classNameTicketList = 'ticketResult__list'
      // let Description = this.manageDescription(ticket.Description)
      let Description = ticket.Description
      classNameTicketList = ticket.IsPackageTicket ? classNameTicketList + ' IsPackageTicket' : classNameTicketList
      return (
        <div className={classNameTicketList} key={ticket.AreaCategoryCode + Description}>
          <div>
            <div>{Description}</div>
            <div>{(ticket.PriceInCents / 100) + ' บาท'}</div>
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
    this.state.selectedList = this.state.seatsSelected.map(seat => seat.rowPhysicalName + seat.Id)
    let selectedList = this.state.selectedList.join()
    let totalPrice = 0
    this.state.seatsSelected.forEach(seat => {
      totalPrice += seat.ticket.PriceInCents / 100
      sessionStorage.setItem('BookingPrice',totalPrice*100)
      sessionStorage.setItem('BookingPriceDisplay',totalPrice)
    })
    return (
      <div className="ticketResult__selectedAndPrice">
        <div className="ticketResult__selectedLists">
          {selectedList}
        </div>
        <div className="ticketResult__totalPrice" ref="totalPrice">
        {'รวม ' + totalPrice + ' บาท' }
        </div>
      </div>
    )
  }
  styleSeatsContainer () {
    let titleRowSpace = 50
    document.querySelector('.seatMapScreenWrap').style.paddingLeft = titleRowSpace + 'px'
    let containerWidth = this.refSeatsRow.current.clientWidth + titleRowSpace
    this.refSeatsMainInner.current.style.width = containerWidth + 'px'
    this.refSeatsMain.current.scrollLeft = ((containerWidth - window.innerWidth + titleRowSpace) * 0.5)
  }
  componentDidMount () {
    setTimeout(() => {
      this.styleSeatsContainer()
    }, 150)
  }
  componentWillMount () {
    this.state.areas.map(area => {
      if (this.state.seatColMax < area.ColumnCount) this.state.seatColMax = area.ColumnCount
      if (this.state.seatRowMax < area.RowCount) this.state.seatRowMax = area.RowCount
    })
    this.state.seatMatrix = new Array(this.state.seatRowMax)
    for (let row = 0; row < this.state.seatRowMax; row++) {
      this.state.seatMatrix[row] = new Array(this.state.seatColMax)
    }
        
    this.state.areas.forEach(area => {      
      for (let row = 0; row < area.Rows.length; row++) {        
        let seatsObj = area.Rows[row].Seats        
        if (seatsObj.length) {
          for (let col = 0; col < seatsObj.length; col++) {
            this.state.seatMatrix[row][seatsObj[col].Position.ColumnIndex] = {
              ...seatsObj[col],
              AreaCategoryCode: area.AreaCategoryCode
            }
          }
        }  
      }
    })
    this.setState({ 
      renderSeats: this.listGroups(),
      renderListPrice: this.listPrice()
    })
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
        <div className="seatMapMain" ref={this.refSeatsMain}>
          <div className="seatMapMain__inner" ref={this.refSeatsMainInner}>
            <div className="seatMapScreenWrap">
              <div className="seatMapScreen" ref={this.refScreen}>
                <div className="seatMapScreen__inner"></div>
              </div>
            </div>
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