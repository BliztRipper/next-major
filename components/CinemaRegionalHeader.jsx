import React, { Component } from 'react';
import CardCinemaRegional from "./CardCinemaRegional";


class CinemaRegionalHeader extends Component {
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

  GenHeader(name) {
    return (
      <div className="cinema__regional">
        <div className="cinema__regional__header">
          <h5 className="cinema__regional__title">{name}</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'} onClick={this.favAddActiveClass}></div>
        </div>
      </div>
    );
  }

  render() {
    var rows = []
    var cells = []
    rows.push(this.GenHeader(this.props.zone_name))
    this.props.items.map((item,i) => {
      cells.push(<CardCinemaRegional name={item.name}/>)
    })

    rows.push(
      <div className={this.state.favActive? 'card-cinema__container active':'card-cinema__container'}>
        {cells}
      </div>
    )
    return (
      <div>
        {rows}
      </div>
    );
  }
}

export default CinemaRegionalHeader;
