import { PureComponent } from 'react'
import './SeatMapDisplay.scss'

class SeatMapDisplay extends PureComponent {
  render () {
    let areas = this.props.areaData
    let listItems = (area) => {
      let arr = []
      arr = area.Rows.map(row => {
        if (row.PhysicalName !== null) {
          return (
            <div className="seatMapDisplay__row">
              <div className="seatMapDisplay__cell seatMapDisplay__cell-title" key={area.AreaCategoryCode + row.PhysicalName }>{row.PhysicalName}</div>
              {
                row.Seats.map((aSeat, index) => {
                  console.log(aSeat, 'aSeat index')
                  return (
                    <div className="seatMapDisplay__cell" key={area.AreaCategoryCode + row.PhysicalName + index}>{(index + 1)}</div>
                  )
                })
              }
            </div>
          )
        }
      });
      return arr
    }       
    let listGroups = areas.map((area) => {
      return (
        <div className={ 'seatMapDisplay__group-' + area.Description.replace(/ /g,'') } key={area.AreaCategoryCode}>
          <div className="seatMapDisplay__title">{area.Description}</div>
          {listItems(area)}
        </div>
      );
    })
    console.log(listGroups) 
    return (
      <div className="seatMapDisplay">
        {listGroups}
      </div>
    )
  }
}

export default SeatMapDisplay;