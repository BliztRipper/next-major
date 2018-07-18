import React, { Component } from 'react';

class CardCinema extends Component {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      favCineActive:false
    }
  }

  favCineActiveClass() {
    this.setState({
      favCineActive: !this.state.favCineActive
    })
  }

  render() {
    return (
        <div className="card-cinema__body">
            <div className="sprite-quatierCine"></div>
              <div className="card-cinema__CineTitle">
                <div className="card-cinema__CineName">{this.props.item.Name}</div>
                <div className="card-cinema__CineDistant">100 m</div>
              </div>
              <div  className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
        </div>
    );
  }
}

export default CardCinema;
