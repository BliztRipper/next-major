import React, { PureComponent, Fragment } from 'react';
import CardCinemaRegional from "./CardCinemaRegional";


class CinemaRegionalComp extends PureComponent {
  constructor(props) {
    super(props);
    this.favAddActiveClass= this.favAddActiveClass.bind(this);
    this.state = {
      favActive: false,
      dataFav: this.props.dataFav,
    }
  }
  
  hasFav(cineId) {
    let found = false
    if (this.state.dataFav && this.state.dataFav.data.CinemaIds) {
      this.state.dataFav.data.CinemaIds.map(favId=>{
        if(favId === cineId) {
          found = true
          return found
        }
      })
    }

    return found
  }

  favAddActiveClass() {
    this.setState({
      favActive: !this.state.favActive
    })
  }
 
  RenderHeader(zone_name) {
    return (
      <div className="cinema__regional" onClick={this.favAddActiveClass} key={zone_name}>
        <div className="cinema__regional__header">
          <h5 className="cinema__regional__title">{zone_name}</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'} ></div>
        </div>
      </div>
    );
  }

  render() {
    var ToggleHeader = []
    var CardRegionalBody = []
    ToggleHeader.push(this.RenderHeader(this.props.zone_name))
    this.props.items.map((item) => {
      CardRegionalBody.push(<CardCinemaRegional accid={this.props.accid} name={item.name} cineId={item.cinemaId} brandname={item.brandName} favCineActive={this.hasFav(item.cinemaId)}/>)
    })
    ToggleHeader.push(
      <div className={this.state.favActive? 'card-cinema__container active':'card-cinema__container'} key={'ToggleHeader'}>
        {CardRegionalBody}
      </div>
    )

    
    return (
      <Fragment>
        {ToggleHeader}
      </Fragment>
    );
  }
}

export default CinemaRegionalComp;
