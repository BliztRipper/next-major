import React, { PureComponent } from 'react';
import loading from '../static/loading.gif'
import Link from 'next/link'

class CardCinemaRegional extends PureComponent {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      favCineActive:false,
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

  favCineActiveClass() {
    this.setState({
      favCineActive: !this.state.favCineActive
    })
  }

  getCineId(){
    // console.log(this.refs.cineIdProp.innerText);
    let id = this.refs.cineIdProp.innerText
    sessionStorage.setItem('CinemaID',id)
  }

  render() {
    const cineIdHide = {display:'none'}
    
    const {isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }

    
    return (
          <div className="cinema__regional__body" onClick={this.getCineId.bind(this)}>
            <div className="sprite-quatierCine"></div>
            <Link prefetch href="/SelectMovieByCinema">
              <div className="card-cinema__CineTitle">
                <div className="card-cinema__CineName">{this.props.name}</div>
                <div className="card-cinema__CineDistant">100m</div>
                <div ref="cineIdProp" style={cineIdHide}>{this.props.cineId}</div>
              </div>
            </Link>  
            <div className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
        </div>
    );
  } 
}

export default CardCinemaRegional;
