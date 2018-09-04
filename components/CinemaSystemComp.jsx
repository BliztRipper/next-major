import React, { PureComponent, Fragment } from 'react';
import CardCinemaSystem from "./CardCinemaSystem";


class CinemaSystemComp extends PureComponent {
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

  render() {
    var ToggleHeader = []
    var CardRegionalBody = []
    ToggleHeader.push(this.RenderHeader(this.props.zoneName))
    this.props.items.map((item) => {
      CardRegionalBody.push(<CardCinemaSystem item={item} name={item.name} key={item.cinemaId} cineId={item.cinemaId} brandname={item.brandName} accid={this.props.accid} />)
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
