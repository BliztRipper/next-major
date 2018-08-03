import React, { PureComponent, Fragment } from 'react';
import CinemaRegionalComp from "./CinemaRegionalComp";
import loading from '../static/loading.gif'

class CinemaRegionalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      branchRegion:[],
      renderRegion:[],
      favActive:false
    }
  }

  componentDidMount(){
    try{
      fetch(`https://api-cinema.truemoney.net/Branches`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data, isLoading: false}))
    } catch(error){
      error => this.setState({ error, isLoading: false })
    }
  }

  render() {
    const {dataObj, isLoading, error, branchRegion, renderRegion} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }
    dataObj.map(region=>{
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
          name:region.NameAlt,
          cinemaId:region.ID,
          brandName:brand,
        }) 
      }
    })

    {(() => {
      for (var region in branchRegion) {
        renderRegion.push(<CinemaRegionalComp zone_name={region} items={branchRegion[region]} cinemaId={branchRegion[region].cinemaId} brandName={branchRegion[region].brandName}/>)
      }
    })()}
    return (
      <Fragment>{renderRegion}</Fragment>
    );
  }
}

export default CinemaRegionalList; 
