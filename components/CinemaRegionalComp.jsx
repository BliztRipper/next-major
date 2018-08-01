import React, { PureComponent, Fragment } from 'react';
import CardCinemaRegional from "./CardCinemaRegional";


class CinemaRegionalComp extends PureComponent {
  constructor(props) {
    super(props);
    this.favAddActiveClass= this.favAddActiveClass.bind(this);
    this.state = {
      favActive: false,
    }
  }

  favAddActiveClass() {
    this.setState({
      favActive: !this.state.favActive
    })
  }
 
  RenderHeader(zone_name) {
    return (
      <div className="cinema__regional" onClick={this.favAddActiveClass}>
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
      CardRegionalBody.push(<CardCinemaRegional name={item.name} key={item.cinemaId}/>)
      console.log(item.cinemaId);
    })
    ToggleHeader.push(
      <div className={this.state.favActive? 'card-cinema__container active':'card-cinema__container'}>
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
