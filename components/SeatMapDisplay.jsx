import { PureComponent, Fragment } from 'react'
import './SeatMapDisplay.scss'

class SeatMapDisplay extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
        areas: this.props.areaData,
        seatsSelected: [],
        renderSeats: null,
        tickets: this.props.ticketData,
        renderListPrice: null,
        renderListSelectedAndPrice: null
      }
  }
  handleSelectSeats (aSeat, area, row, ticket) {
    if (aSeat.Status === 99) {
      aSeat.Status = 0
      this.setState({seatsSelected: this.state.seatsSelected.filter((element) => { 
          let matchSeatBefore = element.Id === aSeat.Id && element.AreaCategoryCode === area.AreaCategoryCode && element.rowPhysicalName === row.PhysicalName
          return !matchSeatBefore 
        })
      })
    } else if (aSeat.Status === 0) {
      aSeat.Status = 99
      this.state.seatsSelected.push({
        ...aSeat,
        AreaCategoryCode: area.AreaCategoryCode,
        rowPhysicalName: row.PhysicalName,
        Description: area.Description,
        ticket: {
          price: ticket.PriceInCents / 100
        }
      })
    }
    this.setState({
      renderSeats: this.listGroups()
    })
  }
  manageDescription (str) {
    let word = 'hair'
    if (str.search(word) >= 0) {
      return str.substring(0, str.indexOf(word) - 1)
    } else {
      return str
    }
  }
  listItems (area, ticket) {
    let arr = []
    arr = area.Rows.map((row, rowIndex) => {
      if (row.PhysicalName !== null) {
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
            <div className={classNameCell} key={area.AreaCategoryCode + row.PhysicalName + aSeatIndex} onClick={this.handleSelectSeats.bind(this, aSeat, area, row, ticket)} >{(aSeat.Id)}</div>
          )
        })
        return (
          <Fragment key={'Fragment' + row.PhysicalName + rowIndex}>
            {seatMapCell}
            <div className="seatMapDisplay__cell seatMapDisplay__cell-title" key={area.AreaCategoryCode + row.PhysicalName }>{row.PhysicalName}</div>
          </Fragment>
        )
      }
    })
    return arr
  }
  listGroups () {
    return (
      this.state.areas.map(area => {
        let classNameGroupSpecific = area.AreaCategoryCode === '0000000008' ? 'isPremium' : area.AreaCategoryCode === '0000000016' ? 'isPrivilege' : ''
        let ticket = this.state.tickets.filter(ticket => ticket.AreaCategoryCode === area.AreaCategoryCode)
        ticket = ticket[0]
        let Description = this.manageDescription(area.Description)
        return (
          <div className={ 'seatMapDisplay__group ' + classNameGroupSpecific } key={area.AreaCategoryCode}>
            <div className="seatMapDisplay__title" key={'title' + area.AreaCategoryCode + area.Description }>{Description}</div>
            <div className="seatMapDisplay__row" key={'row' + area.AreaCategoryCode + area.Description }>
              {this.listItems(area, ticket)}
            </div>
          </div>
        );
      })
    )
  }
  listPrice () {
    let ticketList = this.state.tickets.map(element => {
      let classNameTicketList = 'ticketResult__list'
      classNameTicketList = element.AreaCategoryCode === '0000000008' ? classNameTicketList + ' isPremium' : element.AreaCategoryCode === '0000000016' ? classNameTicketList + ' isPrivilege' : ''
      let Description = this.manageDescription(element.Description)
      return (
        <div className={classNameTicketList} key={element.AreaCategoryCode}>
          <div>{Description}</div>
          <div>{(element.PriceInCents / 100) + 'บาท'}</div>
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
      totalPrice += seat.ticket.price
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
  render () {
    const {renderSeats, renderListPrice} = this.state
    if (!renderSeats) return false
    return (
      <Fragment>
        <div className="seatMapDisplay">
          {renderSeats}
        </div>
        <div className="ticketResult">
          {renderListPrice}
          {this.listSelectedAndPrice()}
        </div> 
      </Fragment>
    )
  }
}

export default SeatMapDisplay;