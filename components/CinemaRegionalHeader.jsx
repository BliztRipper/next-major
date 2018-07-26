import React, { Component } from 'react';


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
  render() {
    return (
      <div className="cinema__regional">
        <div className="cinema__regional__header">
          <h5 className="cinema__regional__title">{this.props.title}</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'} onClick={this.favAddActiveClass}></div>
        </div>
        <div className={this.state.favActive? 'card-cinema__container active':'card-cinema__container'}>
          <div className="cinema__regional__body">
            <div className="sprite-quatierCine"></div>
            <div className="card-cinema__CineTitle">
              <div className="card-cinema__CineName">{this.props.name}</div>
              <div className="card-cinema__CineDistant">100 m</div>
            </div>
            <div  className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
        </div>
        </div>
      </div>
    );
  }
}

export default CinemaRegionalHeader;
