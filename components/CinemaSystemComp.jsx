import React, { PureComponent, Fragment } from 'react';
import CardCinemaSystem from "./CardCinemaSystem";


class CinemaSystemComp extends PureComponent {
  constructor(props) {
    super(props);
    this.favAddActiveClass= this.favAddActiveClass.bind(this);
    this.state = {
      favActive: false,
      dataFav : this.props.dataFav,
    }
  }
  

  favAddActiveClass() {
    this.setState({
      favActive: !this.state.favActive
    })
  }
 
  RenderHeader(zoneName) {
    return (
      <div className="cinema__regional" onClick={this.favAddActiveClass} key={zoneName}>
        <div className="cinema__regional__header">
          <img src={`./static/${zoneName}.png`} />
          <h5 className="cinema__regional__title">{zoneName}</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'} ></div>
        </div>
      </div>
    );
  }

  hasFav(cineId) {
    let found = false
    if (this.state.dataFav.data.CinemaIds) {
      this.state.dataFav.data.CinemaIds.map(favId=>{
        if(favId === cineId) {
          found = true
          return found
        }
      })
    }
    return found
  }

  render() {
    var ToggleHeader = []
    var CardRegionalBody = []
    ToggleHeader.push(this.RenderHeader(this.props.zoneName))
    this.props.items.map((item) => {
      CardRegionalBody.push(<CardCinemaSystem item={item} accid={this.props.accid} dataFav={this.state.dataFav} favCineActive={this.hasFav(item.cinemaId)}/>)
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

export default CinemaSystemComp;
