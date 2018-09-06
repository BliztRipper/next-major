import { PureComponent, Fragment } from 'react'
import Swal from 'sweetalert2'

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
    return this.state.tickets.filter(ticket => ticket.AreaCategoryCode === AreaCategoryCode)[0]
  }
  getAreaByAreaCode (AreaCategoryCode) {
    return this.state.areas.filter(area => area.AreaCategoryCode === AreaCategoryCode)[0]
  }
  handleSelectSeats (aSeat) {
    if (this.state.seatsSelected.length && (this.state.areaSelected !== aSeat.AreaCategoryCode) || !this.getTicketByAreaCode(aSeat.AreaCategoryCode)) return false
    let ticket = this.getTicketByAreaCode(aSeat.AreaCategoryCode)
    let selectRow = this.state.seatMatrix[aSeat.Position.RowIndex]
    let ticketBookedMax = 6
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
          return !(aSeatSelected.Id === aSeat.Id)
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
          if (this.state.seatsSelected.length >= ticketBookedMax) {
            Swal({
              title: 'ขออภัย',
              text: `ลูกค้าสามารถจองที่นั่งได้ไม่เกิน ${ticketBookedMax} ที่นั่ง ต่อการซื้อตั๋วหนึ่งครั้ง`
            })
          } else {
            this.state.areaSelected = aSeat.AreaCategoryCode
            aSeat.Status = bookingStatus
            this.state.seatsSelected.push({
              ...aSeat,
              ticket: ticket
            })
            this.setState({
              seatsSelected: this.state.seatsSelected
            })
          }
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
  listGroups () {
    let ticketZone = 0
    let prevAreaCategoryCode = ''
    return (
      <Fragment>
      {
        this.state.seatMatrix.slice().reverse().map((rows, rowsIndex, rowsArray) => {
          let classNameSelected = ''
          let areaCategoryCode = ''
          let physicalName = ''
          let seatMapCell = rows.map((aSeat, aSeatIndex, aSeatArray) => {
            areaCategoryCode = aSeat.AreaCategoryCode
            physicalName = aSeat.PhysicalName
            if (this.getTicketByAreaCode(aSeat.AreaCategoryCode) && this.getTicketByAreaCode(aSeat.AreaCategoryCode) !== prevAreaCategoryCode) {
              ticketZone++
              prevAreaCategoryCode = this.getTicketByAreaCode(aSeat.AreaCategoryCode)
            }
            if (aSeat.AreaCategoryCode === this.state.areaSelected) {
              classNameSelected = 'selected'
            } else {
              classNameSelected = ''
            }
            let classNameCell = 'seatMapDisplay__cell'
            if (aSeat.Status !== 0) {
              if (aSeat.Status === 99) {
                classNameCell = classNameCell + ' ' + 'selected'
              } else {
                classNameCell = classNameCell + ' ' + 'notAllowed'
              }
            }
            return (
              <div className={classNameCell} style={ {'--col-seat': aSeat.Position.ColumnIndex} } key={aSeat.PhysicalName + aSeat.Position.ColumnIndex} onClick={this.handleSelectSeats.bind(this, aSeat, rows)} >
                <div>{(aSeatIndex)}</div>
              </div>
            )
          })
          return (
            <div className={ 'seatMapDisplay__group ' + classNameSelected} data-area={ticketZone} key={areaCategoryCode + rowsIndex}>
              <div className="seatMapDisplay__title">{physicalName}</div>
              <div className={'seatMapDisplay__row'} ref={this.refSeatsRow} style={ {'--total-seat': this.state.seatColMax - 1} }> 
                {seatMapCell}
              </div>
            </div>
          )
        })
      }
      </Fragment>
    )
  }
  listPrice () {
    let ticketList = this.state.tickets.map(ticket => {
      let classNameTicketList = 'ticketResult__list'
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
    this.state.selectedList = this.state.seatsSelected.map(aSeatSelected => aSeatSelected.PhysicalName + aSeatSelected.Position.ColumnIndex)
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
  disableStyleSeatsContainer () {
    let titleRowSpace = 50
    document.querySelector('.seatMapScreenWrap').style.paddingLeft = titleRowSpace + 'px'
    let containerWidth = this.refSeatsRow.current.clientWidth + titleRowSpace
    this.refSeatsMainInner.current.style.width = containerWidth + 'px'
    this.refSeatsMain.current.scrollLeft = ((containerWidth - window.innerWidth + titleRowSpace) * 0.5)
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
    let seatsObj = ''
    let prevAreaCategoryCode = ''
    let statusAllowByTicket = ''
    this.state.areas.forEach(area => {      
      for (let rowIndex = 0; rowIndex < area.Rows.length; rowIndex++) {        
        seatsObj = area.Rows[rowIndex].Seats        
        if (seatsObj.length) {
          for (let col = 0; col < seatsObj.length; col++) {
            statusAllowByTicket = 'noTicket'
            if (this.getTicketByAreaCode(area.AreaCategoryCode)) {
              prevAreaCategoryCode = this.getTicketByAreaCode(area.AreaCategoryCode)
              statusAllowByTicket = seatsObj[col].OriginalStatus
            }
            this.state.seatMatrix[rowIndex][seatsObj[col].Position.ColumnIndex] = {
              ...seatsObj[col],
              AreaCategoryCode: area.AreaCategoryCode,
              PhysicalName: area.Rows[rowIndex].PhysicalName,
              Status: statusAllowByTicket
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
        <div className="seatMapMain" ref={this.refSeatsMain} onClick={this.props.handleToggleZoomSeatsMap}>
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