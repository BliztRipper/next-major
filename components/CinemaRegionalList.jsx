import React, { PureComponent, Fragment } from 'react';
import CinemaRegionalComp from "./CinemaRegionalComp";

class CinemaRegionalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataFav: this.props.dataFav,
      dataCine: this.props.dataCine,
      branchRegion:[],
      renderRegion:[],
      favActive:false
    }
  }

  render() {
    const {dataCine, branchRegion, renderRegion} = this.state;

    dataCine.map(region=>{
      let key = region.DescriptionInside.zone_name
      if (key in branchRegion == false){
        branchRegion[key] = []
      } 
      let brand = region.DescriptionInside.brand_name_en
      brand = brand.replace(/ +/g, "")
      if (region.NameAlt == ''){
        branchRegion[key].push({
          zoneId: region.DescriptionInside.zone_id,
          title:region.DescriptionInside.zone_name,
          name:region.Name,
          cinemaId:region.ID,
          brandName:brand,
        }) 
      } else {
        branchRegion[key].push({
          zoneId: region.DescriptionInside.zone_id,
          title:region.DescriptionInside.zone_name,
          name:region.Name,
          cinemaId:region.ID,
          brandName:brand,
        }) 
      }
    })

    {(() => {
      for (var region in branchRegion) {
        renderRegion.push(<CinemaRegionalComp zone_name={region} key={region} items={branchRegion[region]} accid={this.props.accid} dataFav={this.state.dataFav}/>)
      }
    })()}
    return (
      <Fragment>{renderRegion}</Fragment>
    );
  }
}

export default CinemaRegionalList; 
