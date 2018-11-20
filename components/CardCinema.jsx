import React, { PureComponent } from 'react';
import Link from 'next/link'
import { URL_PROD } from '../lib/URL_ENV';

class CardCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      favCineActive: this.props.favCineActive,
    }
  }

  favCineActiveClass() {
    let CinemaID = this.props.item.ID
    let phoneNum = this.props.accid
    if(this.state.favCineActive == false) {
      fetch(`${URL_PROD}/AddFavCinema/${phoneNum}/${CinemaID}`)
      .then(this.setState({favCineActive: true}))
    } else{
      fetch(`${URL_PROD}/RemoveFavCinema/${phoneNum}/${CinemaID}`)
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
    let dataToSelectCinema = {
      pathname: '/SelectMovieByCinema'
    }
    return (
        <div ref="searchCine" className="card-cinema__body" onClick={this.getCineId.bind(this)}>
            <div className={this.props.brandname!=""? this.props.brandname:'sprite-blank'}></div>
            <Link prefetch href={ dataToSelectCinema }>
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
