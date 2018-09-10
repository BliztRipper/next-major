import { PureComponent, Fragment } from 'react'
import Swal from 'sweetalert2'
import Hammer from 'react-hammerjs'

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
        // ==== begin pinch pan zoom
        minScale: 1,
        maxScale: 4,
        imageWidth: 0,
        imageHeight: 0,
        containerWidth: 0,
        containerHeight: 0,
        displayImageX: 0,
        displayImageY: 0,
        displayImageScale: 1,
        displayDefaultWidth: 0,
        displayDefaultHeight: 0,
        rangeX: 0,
        rangeMaxX: 0,
        rangeMinX: 0,
        rangeY: 0,
        rangeMaxY: 0,
        rangeMinY: 0,
        displayImageRangeY: 0,
        displayImageCurrentX: 0,
        displayImageCurrentY: 0,
        displayImageCurrentScale: 1,
        // end pinch pan zoom ====
      }
      this.refSeatsRow = React.createRef()
      this.refSeatsMainInner = React.createRef()
      this.refSeatsMain = React.createRef()
      this.refSeatsHammer = React.createRef()
  }
  getTicketByAreaCode (AreaCategoryCode) {
    return this.state.tickets.filter(ticket => ticket.AreaCategoryCode === AreaCategoryCode)[0]
  }
  getAreaByAreaCode (AreaCategoryCode) {
    return this.state.areas.filter(area => area.AreaCategoryCode === AreaCategoryCode)[0]
  }
  handleSelectSeats (aSeat) {
    if (this.state.seatsSelected.length && (this.state.areaSelected !== aSeat.AreaCategoryCode) || !this.getTicketByAreaCode(aSeat.AreaCategoryCode)) return false
    let ticketBookedMax = 6
    let selectRow = this.state.seatMatrix[aSeat.Position.RowIndex]
    let ticket = this.getTicketByAreaCode(aSeat.AreaCategoryCode)
    let toggleBooked = (aSeat) => {
      if (aSeat.Status === '') { // Already booked a seat
        aSeat.Status = 0
        this.state.seatsSelected = this.state.seatsSelected.filter((aSeatSelected) => {
          return !(aSeatSelected.Id === aSeat.Id)
        })
      } else if (aSeat.Status === 0) { // Allow book a seat
        if (this.state.seatsSelected.length >= ticketBookedMax) {
          Swal({
            title: 'ขออภัย',
            html: `ลูกค้าสามารถจองที่นั่งได้ไม่เกิน ${ticketBookedMax} ที่นั่ง <br/> ต่อการซื้อตั๋วหนึ่งครั้ง`
          })
        } else {
          this.state.areaSelected = aSeat.AreaCategoryCode
          aSeat.Status = ''
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
    if (ticket.IsPackageTicket) {
      aSeat.SeatsInGroup.forEach(seatInGroup => {
        selectRow.forEach((aSeatInSelectRow) => {
          if (seatInGroup.ColumnIndex === aSeatInSelectRow.Position.ColumnIndex) {
            toggleBooked(aSeatInSelectRow)
          }
        })
      })
    } else {
      toggleBooked(aSeat)      
    }
    
    this.setState({
      seatsSelected: this.state.seatsSelected,
      areaSelected: this.state.areaSelected,
      renderSeats: this.listGroups()
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
        this.props.authOtpHasToken(this.state.seatsSelected)
        sessionStorage.setItem('BookingSeat',this.state.selectedList)
        sessionStorage.setItem('BookingSeatTotal',this.state.seatsSelected.length)
      } else {
        Swal({
          customClass: 'notAllowedSelected',
          html: `<figure class="image"><img src="static/seat-errer.png" alt=""/></figure> ขออภัย กรุณาไม่เว้นที่ว่าง <br/> ระหว่างที่นั่ง`
        })
      }
    } else {
      Swal('กรุณาเลือกที่นั่ง')
    }
  }
  listGroups () {
    let ticketZone = 0
    let prevAreaCategoryCode = ''
    return (
      <Fragment>
      {
        this.state.seatMatrix.slice().reverse().map((rows, rowsIndex) => {
          let classNameSelected = ''
          let areaCategoryCode = ''
          let physicalName = ''
          let seatMapCell = rows.map((aSeat, aSeatIndex) => {
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
              if (aSeat.Status === '') {
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
  // styleSeatsContainer () {
  //   let titleRowSpace = 50
  //   document.querySelector('.seatMapScreenWrap').style.paddingLeft = titleRowSpace + 'px'
  //   let containerWidth = this.refSeatsRow.current.clientWidth + titleRowSpace
  //   this.refSeatsMainInner.current.style.width = containerWidth + 'px'
  //   this.refSeatsMain.current.scrollLeft = ((containerWidth - window.innerWidth + titleRowSpace) * 0.5)
  // }
  // disableStyleSeatsContainer () {
  //   let titleRowSpace = 50
  //   document.querySelector('.seatMapScreenWrap').style.paddingLeft = titleRowSpace + 'px'
  //   let containerWidth = this.refSeatsRow.current.clientWidth + titleRowSpace
  //   this.refSeatsMainInner.current.style.width = containerWidth + 'px'
  //   this.refSeatsMain.current.scrollLeft = ((containerWidth - window.innerWidth + titleRowSpace) * 0.5)
  // }
  componentDidMount () {
    this.initPinchZoomPan()
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
    this.state.displayImage = this.state.imageContainer.children[0]
    this.state.imageWidth = this.state.displayImage.clientWidth;
    this.state.imageHeight = this.state.displayImage.clientHeight;
    this.state.displayDefaultWidth = this.state.displayImage.offsetWidth;
    this.state.displayDefaultHeight = this.state.displayImage.offsetHeight;
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
    this.state.rangeX = Math.max(0, Math.round(this.state.displayDefaultWidth * this.state.displayImageCurrentScale) - this.state.containerWidth);
    this.state.rangeY = Math.max(0, Math.round(this.state.displayDefaultHeight * this.state.displayImageCurrentScale) - this.state.containerHeight);
    
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
  updateDisplayImage(x, y, scale) {
    const transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
    this.state.displayImage.style.transform = transform;
    this.state.displayImage.style.WebkitTransform = transform;
    this.state.displayImage.style.msTransform = transform;
  }
  handleSeatsPan (ev) {
    this.state.displayImageCurrentX = this.clamp(this.state.displayImageX + ev.deltaX, this.state.rangeMinX, this.state.rangeMaxX);
    this.state.displayImageCurrentY = this.clamp(this.state.displayImageY + ev.deltaY, this.state.rangeMinY, this.state.rangeMaxY);
    this.updateDisplayImage(this.state.displayImageCurrentX, this.state.displayImageCurrentY, this.state.displayImageScale);

    this.setState({
      displayImageCurrentX: this.state.displayImageCurrentX,
      displayImageCurrentY: this.state.displayImageCurrentY
    })
  }
  handleSeatsPinch (ev) {
    // alert(this.state.displayImageCurrentScale)
    this.state.displayImageCurrentScale = this.clampScale(ev.scale * this.state.displayImageScale);
    this.updateRange();
    this.state.displayImageCurrentX = this.clamp(this.state.displayImageX + ev.deltaX, this.state.rangeMinX, this.state.rangeMaxX);
    this.state.displayImageCurrentY = this.clamp(this.state.displayImageY + ev.deltaY, this.state.rangeMinY, this.state.rangeMaxY);
    this.updateDisplayImage(this.state.displayImageCurrentX, this.state.displayImageCurrentY, this.state.displayImageCurrentScale);
    this.setState({
      displayImageCurrentScale: this.state.displayImageCurrentScale,
      displayImageCurrentX: this.state.displayImageCurrentX,
      displayImageCurrentY: this.state.displayImageCurrentY
    })
  }
  handleSeatsPinchEnd () {
    this.state.displayImageScale = this.state.displayImageCurrentScale;
    this.state.displayImageX = this.state.displayImageCurrentX;
    this.state.displayImageY = this.state.displayImageCurrentY;
    this.setState({
      displayImageScale: this.state.displayImageScale,
      displayImageX: this.state.displayImageX,
      displayImageY: this.state.displayImageY
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