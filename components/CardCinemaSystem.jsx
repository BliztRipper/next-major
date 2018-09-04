import React, { PureComponent } from 'react';
import loading from '../static/loading.gif'
import Link from 'next/link'

class CardCinemaSystem extends PureComponent {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      dataObj: [],
      dataCine: [],
      isLoading: true,
      error: null,
      favCineActive:false,
    }
  }

  componentWillMount(){
    try{
      fetch(`https://api-cinema.truemoney.net/Branches`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data, isLoading: false}))
      fetch(`https://api-cinema.truemoney.net/FavCinemas/${this.props.accid}`)
      .then(response => response.json())
      .then(data => this.setState({dataCine:data}, function(){
        if(this.state.dataCine.data.CinemaIds != null){
          this.state.dataCine.data.CinemaIds.map(item=>{
            if(item === this.props.item.cinemaId ){
              this.setState({favCineActive:true})
            }
          })
        }
      }))
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }
  favCineActiveClass() {
    let CinemaID = this.refs.cineIdProp.innerText
    let phoneNum = this.props.accid
    if(this.state.favCineActive == true){
      this.setState({favCineActive: !this.state.favCineActive})
      fetch(`https://api-cinema.truemoney.net/RemoveFavCinema/${phoneNum}/${CinemaID}`)
    } else {
      this.setState({favCineActive: !this.state.favCineActive})
      fetch(`https://api-cinema.truemoney.net/AddFavCinema/${phoneNum}/${CinemaID}`)
    }
  }

  getCineId(){
    let id = this.refs.cineIdProp.innerText
    let name = this.refs.cineName.innerText
    sessionStorage.setItem('CinemaID',id)
    sessionStorage.setItem('BookingCinema',name)
  }

  render() {
    const cineIdHide = {display:'none'}
    const {isLoading, error} = this.state;
    let dataToSelectCinema = {
      pathname: '/SelectMovieByCinema',
      query: {
        accid: this.props.accid
      }
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }
    
    return (
          <div ref="searchCine" className="cinema__regional__body" onClick={this.getCineId.bind(this)}>
            <div className={this.props.brandname!=""? this.props.brandname:'sprite-blank'}></div>
            <Link prefetch href={dataToSelectCinema}>
              <div className="card-cinema__CineTitle">
                <div ref="cineName" className="card-cinema__CineName">{this.props.name}</div>
                {/* <div className="card-cinema__CineDistant">100m</div> */}
                <div ref="cineIdProp" style={cineIdHide}>{this.props.cineId}</div>
              </div>
            </Link>  
            <div ref="classname" className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
        </div>
    );
  } 
}

export default CardCinemaSystem;

