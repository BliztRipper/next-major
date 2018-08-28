import React, { PureComponent } from 'react';
import Link from 'next/link'

class CardCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      favCineActive:false,
    }
  }
  componentDidMount() {
    if(fetch(`https://api-cinema.truemoney.net/FavCinemas/0891916415`).then(response => response.json()).then(data => data != null)){
        this.setState({favCineActive:true})
      }
  }
  
  favCineActiveClass() {
    let CinemaID = this.props.item.ID
    let phoneNum = '0891916415'
    if(this.state.favCineActive == false) {
      fetch(`https://api-cinema.truemoney.net/AddFavCinema/${phoneNum}/${CinemaID}`)
      .then(this.setState({favCineActive: true}))
    } else{
      fetch(`https://api-cinema.truemoney.net/RemoveFavCinema/${phoneNum}/${CinemaID}`)
      .then(this.setState({favCineActive: false}))
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
    return (
        <div ref="searchCine" className="card-cinema__body" onClick={this.getCineId.bind(this)}>
            <div className={this.props.brandname!=""? this.props.brandname:'sprite-blank'}></div>
            <Link prefetch href="/SelectMovieByCinema">
              <div className="card-cinema__CineTitle">
                <div ref="cineName" className="card-cinema__CineName">{this.props.item.Name}</div>
                {/* <div className="card-cinema__CineDistant">100 m</div> */}
                <div ref="cineIdProp" style={cineIdHide}>{this.props.item.ID}</div>
              </div>
            </Link>    
              <div  className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
        </div>
    );
  } 
}

export default CardCinema;
