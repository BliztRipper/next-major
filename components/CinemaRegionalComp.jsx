import React, { PureComponent } from 'react';
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
      <div className="cinema__regional">
        <div className="cinema__regional__header">
          <h5 className="cinema__regional__title">{zone_name}</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'} onClick={this.favAddActiveClass}></div>
        </div>
      </div>
    );
  }

  render() {
    var ToggleHeader = []
    var CardRegionalBody = []
    ToggleHeader.push(this.RenderHeader(this.props.zone_name))
    this.props.items.map((item,i) => {
      CardRegionalBody.push(<CardCinemaRegional name={item.name} key={i}/>)
    })
    ToggleHeader.push(
      <div className={this.state.favActive? 'card-cinema__container active':'card-cinema__container'}>
        {CardRegionalBody}
      </div>
    )
    return (
      <div>
        {ToggleHeader}
      </div>
    );
  }
}

export default CinemaRegionalComp;
