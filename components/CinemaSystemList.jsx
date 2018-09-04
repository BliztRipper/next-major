import React, { PureComponent, Fragment } from 'react';
import CinemaSystemComp from "./CinemaSystemComp";
import loading from '../static/loading.gif'

class CinemaSystemList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      SystemType:[],
      renderSystem:[],
      favActive:false
    }
  }

  componentWillMount(){
    try{
      fetch(`https://api-cinema.truemoney.net/Branches`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data, isLoading: false}))
    } catch(error){
      error => this.setState({ error, isLoading: false })
    }
  }

  render() {
    const {dataObj, isLoading, error, SystemType, renderSystem,} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }
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
        renderSystem.push(<CinemaSystemComp zoneName={system} key={system} items={SystemType[system]} cinemaId={SystemType[system].cinemaId} brandName={SystemType[system].brandName}/>)
      }
    })()}
    return (
      <Fragment>{renderSystem}</Fragment>
    )
  }
}

export default CinemaSystemList; 
