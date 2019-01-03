import { PureComponent, Fragment } from 'react'
import Swal from 'sweetalert2'
import Hammer from 'react-hammerjs'
import withReactContent from 'sweetalert2-react-content'
const SweetAlert = withReactContent(Swal)

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
        seatMatrix: [],
        seatsCounter: 0,
        // ==== begin pinch pan zoom
        minScale: 1,
        maxScale: 4,
        containerWidth: 0,
        containerHeight: 0,
        displaySeatsX: 0,
        displaySeatsY: 0,
        displaySeatsScale: 1,
        displayDefaultWidth: 0,
        displayDefaultHeight: 0,
        rangeX: 0,
        rangeMaxX: 0,
        rangeMinX: 0,
        rangeY: 0,
        rangeMaxY: 0,
        rangeMinY: 0,
        displaySeatsRangeY: 0,
        displaySeatsCurrentX: 0,
        displaySeatsCurrentY: 0,
        displaySeatsCurrentScale: 1,
        // end pinch pan zoom ====
      }

      // ref
      this.refSeatsRow = React.createRef()
      this.refSeatsMainInner = React.createRef()
      this.refSeatsMain = React.createRef()
      this.refSeatsHammer = React.createRef()
      this.refTicketResultListsInner = React.createRef()
  }
  getTicketByAreaCode (AreaCategoryCode) {
    return this.state.tickets.filter(ticket => ticket.AreaCategoryCode === AreaCategoryCode)[0]
  }
  getAreaByAreaCode (AreaCategoryCode) {
    return this.state.areas.filter(area => area.AreaCategoryCode === AreaCategoryCode)[0]
  }
  handleSelectSeats (aSeat) {
    if (this.state.postingTicket || this.state.seatsSelected.length && (this.state.areaSelected !== aSeat.AreaCategoryCode) || !this.getTicketByAreaCode(aSeat.AreaCategoryCode)) return false

    let seatsCounter = this.state.seatsCounter
    let ticketBookedMax = 6
    let selectRow = this.state.seatMatrix[aSeat.Position.RowIndex]

    let ticket = this.getTicketByAreaCode(aSeat.AreaCategoryCode)

    let toggleBooked = (aSeat, isPackage) => {
      if (aSeat.Status === 'myBooking') { // Already booked a seat

        if (!isPackage) {
          seatsCounter -= 1
        }

        aSeat.Status = 0
        this.state.seatsSelected = this.state.seatsSelected.filter((aSeatSelected) => {
          return !(aSeatSelected.Position === aSeat.Position)
        })
        return {
          canBook: true,
          seatStatus: aSeat.Status
        }
      } else if (aSeat.Status === 0) { // Allow book a seat

        if (this.state.seatsSelected.length >= ticketBookedMax) {
          Swal({
            title: 'ขออภัย',
            html: `ลูกค้าสามารถจองที่นั่งได้ไม่เกิน ${ticketBookedMax} ที่นั่ง <br/> ต่อการซื้อตั๋วหนึ่งครั้ง`
          })
          return {
            canBook: false
          }
        } else {

          if (!isPackage) {
            seatsCounter += 1
          }

          this.state.areaSelected = aSeat.AreaCategoryCode
          aSeat.Status = 'myBooking'

          this.state.seatsSelected.push({
            ...aSeat,
            ticket: ticket
          })
          return {
            canBook: true
          }
        }
      } else {
        return {
          canBook: false
        }
      }

    }

    if (ticket.IsPackageTicket) {
      let listSelected = []
      let instantSeat = {
        canBook: true
      }

      if (aSeat.SeatsInGroup) {
        aSeat.SeatsInGroup.forEach(seatInGroup => {
          selectRow.forEach((aSeatInSelectRow) => {

            if (instantSeat.canBook) {
              if (seatInGroup.ColumnIndex === aSeatInSelectRow.Position.ColumnIndex) {

                instantSeat = toggleBooked(aSeatInSelectRow, true)
                if (instantSeat.canBook) {
                  listSelected.push(aSeatInSelectRow)
                }
              }
            } //canBook

          })
        })
      }



      if (!instantSeat.canBook) {
        if (listSelected.length > 0) {
          listSelected.forEach(selected => {
            toggleBooked(selected, true)
          })
        }

      } else {
        // Count a seat from package
        if (instantSeat.seatStatus === 0) {
          // Decrease
          seatsCounter -= 1
        } else {
          // Increase
          seatsCounter += 1
        }
      }

    } else {
      toggleBooked(aSeat)
    }

    if (this.state.seatsSelected.length === 0) {
      this.state.areaSelected = null
    }

    this.setState({
      seatsSelected: this.state.seatsSelected,
      areaSelected: this.state.areaSelected,
      renderSeats: this.listGroups(),
      seatsCounter: seatsCounter
    })
  }
  handleSubmitTicket () {

    if (this.state.postingTicket) return false

    let canBook = (column, selectRow) => {
      if (column < 0) { //out of bound
        return false
      } else if (column > (selectRow.length - 1)) { //out of bound
        return false
      } else if (selectRow[column] == null) { //not seat in index
        return false
      }
      return (selectRow[column].Status === 0)
    }

    let allowBook = true

    this.state.seatsSelected.forEach(aSeatSelected => {
      let selectRow = this.state.seatMatrix[aSeatSelected.Position.RowIndex]
      let cannotBookLeft = canBook(aSeatSelected.Position.ColumnIndex-1, selectRow) && !canBook(aSeatSelected.Position.ColumnIndex-2, selectRow)
      let cannotBookRight = canBook(aSeatSelected.Position.ColumnIndex+1, selectRow) && !canBook(aSeatSelected.Position.ColumnIndex+2, selectRow)
      if (!cannotBookLeft && !cannotBookRight && allowBook) {
        allowBook = true
      } else {
        allowBook = false
      }
    });

    if (this.state.seatsSelected.length) {
      if (allowBook) {
        this.props.authOtpHasToken(this.state.seatsSelected, this.state.seatsCounter)
        sessionStorage.setItem('BookingSeat',this.state.selectedList)
        sessionStorage.setItem('BookingSeatTotal',this.state.seatsSelected.length)
      } else {
        SweetAlert.fire({
          customClass: 'notAllowedSelected',
          html: <div style={{ textAlign: 'center' }}><figure className="image"><img src="../static/seat-errer.png" alt=""/></figure> ขออภัย กรุณาไม่เว้นที่ว่าง <br/> ระหว่างที่นั่ง</div>
        })
      }
    } else {
      Swal('กรุณาเลือกที่นั่ง')
    }
  }
  listGroups () {
    let windowWidth = window.screen.width
    let seatSize = 0
    let prevAreaCategoryCode = ''
    return (
      this.state.seatMatrix.slice().reverse().map((rows, rowsIndex) => {
        let areaCategoryCode = ''
        let physicalName = ''
        let seatMapCell = rows.map((aSeat, aSeatIndex, aSeatArray) => {
          let classNameAnotherArea = ''
          seatSize = Math.floor((windowWidth - (aSeatArray.length + 2)) / (aSeatArray.length + 1))
          areaCategoryCode = aSeat.AreaCategoryCode
          physicalName = aSeat.PhysicalName
          if (this.getTicketByAreaCode(aSeat.AreaCategoryCode) && this.getTicketByAreaCode(aSeat.AreaCategoryCode) !== prevAreaCategoryCode) {
            prevAreaCategoryCode = this.getTicketByAreaCode(aSeat.AreaCategoryCode)
          }
          if (this.state.areaSelected) {
            if (aSeat.AreaCategoryCode !== this.state.areaSelected) {
              classNameAnotherArea = 'areaNotSelected'
            }
          } else {
            classNameAnotherArea = ''
          }
          let classNameCell = 'seatMapDisplay__cell' + ' ' + aSeat.seatTheme
          if (aSeat.Status !== 0) {
            if (aSeat.Status === 'myBooking') {
              classNameCell = classNameCell + ' ' + 'selected'
            } else {
              classNameCell = classNameCell + ' ' + 'notAllowed'
            }
          }
          return (
            <div className={classNameCell + ' ' + classNameAnotherArea} data-column-index={aSeat.Position.ColumnIndex} style={ {'--col-seat': aSeat.Position.ColumnIndex} } key={aSeat.PhysicalName + aSeat.Position.ColumnIndex} onClick={this.handleSelectSeats.bind(this, aSeat)} >
              <div>{(aSeat.Id)}</div>
            </div>
          )
        })
        let dataToSeatStyles = {
          '--total-seat': this.state.seatColMax - 1,
          '--seat-size': seatSize + 'px',
          '--seat-gap': 1 + 'px',
          '--seat-font-size': Math.floor(seatSize * 0.3) + 'px'
        }
        return (
          <div className={ 'seatMapDisplay__group '} key={areaCategoryCode + rowsIndex} style={dataToSeatStyles}>
            <div className="seatMapDisplay__title">{physicalName}</div>
            <div className={'seatMapDisplay__row'} ref={this.refSeatsRow}>
              {seatMapCell}
            </div>
          </div>
        )
      })
    )
  }
  listPrice () {
    let ticketList = this.state.tickets.map(ticket => {
      let classNameTicketList = 'ticketResult__list' + ' ' + ticket.seatTheme
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
      <div className="classNameTicketLists">
        <div className="ticketResult__listsInner" ref={this.refTicketResultListsInner}>
          {ticketList}
        </div>
      </div>
    )
  }
  listSelectedAndPrice () {
    this.state.selectedList = this.state.seatsSelected.map(aSeatSelected => aSeatSelected.PhysicalName + aSeatSelected.Id)
    let selectedList = this.state.selectedList.join()
    let totalPrice = 0
    this.state.seatsSelected.forEach((seat, seatIndex, seatArray) => {
      totalPrice += seat.ticket.PriceInCents / 100

      if (seat.ticket.IsPackageTicket && seat.SeatsInGroup) {
        if (seatArray.length === seatIndex + 1) {
          totalPrice = totalPrice / seat.SeatsInGroup.length
        }
      }
      sessionStorage.setItem('BookingPrice', totalPrice * 100)
      sessionStorage.setItem('BookingPriceDisplay', totalPrice)
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
  componentDidMount () {
    this.initPinchZoomPan()
    let totalTicketResultListWidth = 0
    this.refTicketResultListsInner.current.childNodes.forEach(child => {
      totalTicketResultListWidth += child.clientWidth
    });
    if (window.innerWidth < totalTicketResultListWidth) {
      this.refTicketResultListsInner.current.parentNode.classList.add('needOverflow')
    } else {
      this.refTicketResultListsInner.current.parentNode.classList.remove('needOverflow')
    }
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
    let statusAllowByTicket = ''
    this.state.areas.forEach(area => {
      for (let rowIndex = 0; rowIndex < area.Rows.length; rowIndex++) {
        seatsObj = area.Rows[rowIndex].Seats
        if (seatsObj.length) {
          for (let col = 0; col < seatsObj.length; col++) {
            statusAllowByTicket = 'noTicket'
            if (this.getTicketByAreaCode(area.AreaCategoryCode)) {
              statusAllowByTicket = seatsObj[col].OriginalStatus
            }
            this.state.seatMatrix[rowIndex][seatsObj[col].Position.ColumnIndex] = {
              ...seatsObj[col],
              AreaCategoryCode: area.AreaCategoryCode,
              seatTheme: area.seatTheme,
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
  initPinchZoomPan () {
    this.state.imageContainer = this.refSeatsHammer.current.domElement
    this.state.containerWidth = this.state.imageContainer.clientWidth
    this.state.containerHeight = this.state.imageContainer.clientHeight
    this.state.displaySeats = this.state.imageContainer.children[0]
    this.state.displayDefaultWidth = this.state.displaySeats.offsetWidth;
    this.state.displayDefaultHeight = this.state.displaySeats.offsetHeight;
    this.state.rangeX = Math.max(0, this.state.displayDefaultWidth - this.state.containerWidth);
    this.state.rangeY = Math.max(0, this.state.displayDefaultHeight - this.state.containerHeight);
  }
  clamp(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  clampScale(newScale) {
    return this.clamp(newScale, this.state.minScale, this.state.maxScale);
  }
  updateRange() {
    this.state.rangeX = Math.max(0, Math.round(this.state.displayDefaultWidth * this.state.displaySeatsCurrentScale) - this.state.containerWidth);
    this.state.rangeY = Math.max(0, Math.round(this.state.displayDefaultHeight * this.state.displaySeatsCurrentScale) - this.state.containerHeight);

    this.state.rangeMaxX = Math.round(this.state.rangeX / 2);
    this.state.rangeMinX = 0 - this.state.rangeMaxX;

    this.state.rangeMaxY = Math.round(this.state.rangeY / 2);
    this.state.rangeMinY = 0 - this.state.rangeMaxY;
    this.setState({
      rangeX: this.state.rangeX,
      rangeY: this.state.rangeY,
      rangeMaxX: this.state.rangeMaxX,
      rangeMinX: this.state.rangeMinX,
      rangeMaxY: this.state.rangeMaxY,
      rangeMinY: this.state.rangeMinY
    })
  }
  updateDisplaySeats(x, y, scale) {
    const transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
    this.state.displaySeats.style.transform = transform;
    this.state.displaySeats.style.WebkitTransform = transform;
    this.state.displaySeats.style.msTransform = transform;
  }
  handleSeatsPan (ev) {
    this.state.displaySeatsCurrentX = this.clamp(this.state.displaySeatsX + ev.deltaX, this.state.rangeMinX, this.state.rangeMaxX);
    this.state.displaySeatsCurrentY = this.clamp(this.state.displaySeatsY + ev.deltaY, this.state.rangeMinY, this.state.rangeMaxY);
    this.updateDisplaySeats(this.state.displaySeatsCurrentX, this.state.displaySeatsCurrentY, this.state.displaySeatsScale);

    this.setState({
      displaySeatsCurrentX: this.state.displaySeatsCurrentX,
      displaySeatsCurrentY: this.state.displaySeatsCurrentY
    })
  }
  handleSeatsPinch (ev) {
    this.state.displaySeatsCurrentScale = this.clampScale(ev.scale * this.state.displaySeatsScale);
    this.updateRange();
    this.state.displaySeatsCurrentX = this.clamp(this.state.displaySeatsX + ev.deltaX, this.state.rangeMinX, this.state.rangeMaxX);
    this.state.displaySeatsCurrentY = this.clamp(this.state.displaySeatsY + ev.deltaY, this.state.rangeMinY, this.state.rangeMaxY);
    this.updateDisplaySeats(this.state.displaySeatsCurrentX, this.state.displaySeatsCurrentY, this.state.displaySeatsCurrentScale);
    this.setState({
      displaySeatsCurrentScale: this.state.displaySeatsCurrentScale,
      displaySeatsCurrentX: this.state.displaySeatsCurrentX,
      displaySeatsCurrentY: this.state.displaySeatsCurrentY
    })
  }
  handleSeatsPinchEnd () {
    this.state.displaySeatsScale = this.state.displaySeatsCurrentScale;
    this.state.displaySeatsX = this.state.displaySeatsCurrentX;
    this.state.displaySeatsY = this.state.displaySeatsCurrentY;
    this.setState({
      displaySeatsScale: this.state.displaySeatsScale,
      displaySeatsX: this.state.displaySeatsX,
      displaySeatsY: this.state.displaySeatsY
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
          <Hammer
            onPan={this.handleSeatsPan.bind(this)}
            onPinch={this.handleSeatsPinch.bind(this)}
            onPanEnd = {this.handleSeatsPinchEnd.bind(this)}
            onPanCancel = {this.handleSeatsPinchEnd.bind(this)}
            onPinchEnd = {this.handleSeatsPinchEnd.bind(this)}
            onPinchCancel = {this.handleSeatsPinchEnd.bind(this)}
            ref={this.refSeatsHammer}
            options={{
              recognizers: {
                  pinch: { enable: true }
              }
            }}
          >
            <div>
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
          </Hammer>
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