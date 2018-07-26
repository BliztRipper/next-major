import React, { Component } from 'react';
import CinemaRegionalHeader from "./CinemaRegionalHeader";
import loading from '../static/loading.gif'

class CinemaRegionalList extends Component {
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
    } catch(err){
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
      branchRegion[key].push({id: region.DescriptionInside.zone_id, title:region.DescriptionInside.zone_name, name:region.NameAlt}) 
    })

    {(() => {
      for (var region in branchRegion) {
        renderRegion.push(<CinemaRegionalHeader zone_name={region} items={branchRegion[region]}/>)
      }
    })()}

    return (
      <div>{renderRegion}</div>
    );
  }
}

export default CinemaRegionalList; 
