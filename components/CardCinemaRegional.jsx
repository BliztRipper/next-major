import React, { PureComponent } from 'react';
import Link from 'next/link'

class CardCinemaRegional extends PureComponent {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      favCineActive: this.props.favCineActive,
    }
  }

  componentWillMount(){

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

    let dataToSelectCinema = {
      pathname: '/SelectMovieByCinema'
    }

    return (
          <div ref="searchCine" className="cinema__regional__body" onClick={this.getCineId.bind(this)}>
            <div className={this.props.brandname!=""? this.props.brandname:'sprite-blank'}></div>
            <Link prefetch href={dataToSelectCinema}>
              <div className="card-cinema__CineTitle">
                <div ref="cineName" className="card-cinema__CineName">{this.props.name}</div>
                <div ref="cineIdProp" style={cineIdHide}>{this.props.cineId}</div>
              </div>
            </Link>
            <div ref="classname" className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
        </div>
    );
  }
}

export default CardCinemaRegional;
