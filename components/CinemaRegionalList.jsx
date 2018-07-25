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
      branchRegion:[]
    }
  }

  componentDidMount(){
    try{
      fetch(`http://api-cinema.truemoney.net/Branches`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data, isLoading: false}))
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }


  renderRegionHeader(){
    let resultsArray = [];
    this.state.branchRegion.map((item, i) => {
      resultsArray.push(<CinemaRegionalHeader title={item.name} key={i}/>)
    });
    return resultsArray;
  }

    
  render() {
    const {dataObj, isLoading, error, branchRegion} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }

    dataObj.map(region=>{
      let key = region.DescriptionInside.zone_id 
      if (key in branchRegion == false){
        branchRegion[key] = []
      } 
      branchRegion[key].push({id: region.DescriptionInside.zone_id, name:region.DescriptionInside.zone_name}) 
      
    })

    console.log(branchRegion);

    return (
      <div>{this.renderRegionHeader()}</div>
    );
  }
}

export default CinemaRegionalList; 
