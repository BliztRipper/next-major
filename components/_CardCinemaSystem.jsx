import React, { PureComponent } from 'react';
import Link from 'next/link'
import { URL_PROD } from '../lib/URL_ENV';

class CardCinemaSystem extends PureComponent {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      dataObj: this.props.dataCine,
      dataCine: this.props.dataFav,
      isLoading: true,
      error: null,
      favCineActive:this.props.favCineActive,
    }
  }

  favCineActiveClass() {
    let CinemaID = this.refs.cineIdProp.innerText
    let phoneNum = this.props.accid
    if(this.state.favCineActive == true){
      this.setState({favCineActive: !this.state.favCineActive})
      fetch(`${URL_PROD}/RemoveFavCinema/${phoneNum}/${CinemaID}`)
    } else {
      this.setState({favCineActive: !this.state.favCineActive})
      fetch(`${URL_PROD}/AddFavCinema/${phoneNum}/${CinemaID}`)
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
          <div ref="searchCine" className="cinema__regional__body" onClick={this.getCineId.bind(this)}>
            <div className={this.props.item.brandname!=""? this.props.item.brandname:'sprite-blank'}></div>
            <Link prefetch href={dataToSelectCinema}>
              <div className="card-cinema__CineTitle">
                <div ref="cineName" className="card-cinema__CineName">{this.props.item.name}</div>
                {/* <div className="card-cinema__CineDistant">100m</div> */}
                <div ref="cineIdProp" style={cineIdHide}>{this.props.item.cinemaId}</div>
              </div>
            </Link>
            <div ref="classname" className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
        </div>
    );
  }
}

export default CardCinemaSystem;

