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

  renderRegionHeader(){
    let resultsArray = [];
    this.state.branchRegion.map((item, i) => {
      resultsArray.push(<CinemaRegionalHeader title={item} name={name} key={i}/>)
    });
    return resultsArray;
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
      for (var region in branchRegion){
        branchRegion[region].map((item,i)=>{
          renderRegion.push(<CinemaRegionalHeader title={item.title} name={item.name} key={i+item.id}/>)
        })
      }   
      console.log(branchRegion);
    })()}

    return (
      <div>{renderRegion}</div>
    );
  }
}

export default CinemaRegionalList; 
