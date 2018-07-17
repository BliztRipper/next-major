import React, { Component } from 'react';
import CardCinema from './CardCinema'

class ListingCinema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
    }
  }

  componentDidMount(){
    try{
      fetch(`http://api-cinema.truemoney.net/Cinemas`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data, isLoading: false}))
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }

  renderCinema(){
    let resultsArray = [];
    this.state.dataObj.map((item, i) => {
      resultsArray.push(<CardCinema item={item} key={i}/>)
    });
    return resultsArray;
  }

  
  render() {
    const {dataObj, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <p>Loading Please wait...</p>;
    }
    return (
      <div>
        {this.renderCinema()}
      </div>
    );
  }
}

export default ListingCinema;
