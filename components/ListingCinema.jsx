import React, { Component } from 'react';

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
  render() {
    const {dataObj, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <p>Loading Please wait...</p>;
    }
    return (
      <div className="cinemaList">
        <div className="cinemaList__header">
          <h2>ควอเทียร์ ซีเนอาร์ต</h2>
          <span>300m</span>
          <div className="sprite-2dDigital"></div>
        </div>
      </div>
    );
  }
}

export default ListingCinema;
