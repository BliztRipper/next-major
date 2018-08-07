import { PureComponent, Fragment } from 'react'
import './SeatMapDisplay.scss'

class SeatMapDisplay extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
        areas: this.props.areaData,
        seatsSelected: [],
        renderSeats: null
      }
  }
  handleSelectSeats (aSeat, area, row) {
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
        rowPhysicalName: row.PhysicalName
      })
    }
    this.setState({
      renderSeats: this.listGroups(this.state.areas)
    })
  }
  listItems (area) {
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
            <div className={classNameCell} key={area.AreaCategoryCode + row.PhysicalName + aSeatIndex} onClick={this.handleSelectSeats.bind(this, aSeat, area, row)} >{(aSeat.Id)}</div>
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
  listGroups (areas) {
    return (
      areas.map((area) => {
        let classNameGroupSpecific = area.AreaCategoryCode === '0000000008' ? 'isPremium' : area.AreaCategoryCode === '0000000016' ? 'isPrivilege' : ''
        return (
          <div className={ 'seatMapDisplay__group ' + classNameGroupSpecific } key={area.AreaCategoryCode}>
            <div className="seatMapDisplay__title" key={'title' + area.AreaCategoryCode + area.Description }>{area.Description}</div>
            <div className="seatMapDisplay__row" key={'row' + area.AreaCategoryCode + area.Description }>
              {this.listItems(area)}
            </div>
          </div>
        );
      })
    )
  }
  componentWillMount () {
    this.setState({ 
      renderSeats: this.listGroups(this.state.areas) 
    })
  }
  render () {
    const {renderSeats} = this.state
    if (!renderSeats) return false
    return (
      <div className="seatMapDisplay">
        {renderSeats}
      </div>
    )
  }
}

export default SeatMapDisplay;