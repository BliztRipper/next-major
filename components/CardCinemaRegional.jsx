import React, { Component } from 'react';
import loading from '../static/loading.gif'

class CardCinemaRegional extends Component {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      favCineActive:false
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
  

  favCineActiveClass() {
    this.setState({
      favCineActive: !this.state.favCineActive
    })
  }

  render() {
    const {dataObj, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }

    
    return (
      <div className="cinema__regional__body">
        <div className="sprite-quatierCine"></div>
        <div className="card-cinema__CineTitle">
          <div className="card-cinema__CineName">sdlsajdlsalkdsa</div>
          <div className="card-cinema__CineDistant">100 m</div>
        </div>
        <div  className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
    </div>
    );
  } 
}

export default CardCinemaRegional;
