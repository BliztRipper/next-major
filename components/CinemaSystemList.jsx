import React, { PureComponent, Fragment } from 'react';
import CinemaSystemComp from "./CinemaSystemComp";

class CinemaSystemList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: this.props.dataCine,
      dataFav: this.props.dataFav,
      SystemType:[],
      renderSystem:[],
      favActive:false
    }
  }

  render() {
    const {dataObj, SystemType, renderSystem,} = this.state;
    dataObj.map(system=>{
      system.System.map(item => {
        let key = item
        if (key in SystemType == false){
          SystemType[key] = []
        } 
        let brand = system.DescriptionInside.brand_name_en
        brand = brand.replace(/ +/g, "")
        SystemType[key].push({
          zoneId: system.DescriptionInside.zone_id,
          title:system.DescriptionInside.zone_name,
          name:system.Name,
          cinemaId:system.ID,
          brandName:brand,
        })
      })
    })

    {(() => {
      for (var system in SystemType) {
        renderSystem.push(<CinemaSystemComp zoneName={system} dataCine={this.props.dataCine} dataFav={this.props.dataFav} key={system} items={SystemType[system]}/>)
      }
    })()}
    return (
      <Fragment>
        {renderSystem}
      </Fragment>
    )
  }
}

export default CinemaSystemList; 
