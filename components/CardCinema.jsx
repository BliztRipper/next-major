import React, { Component } from 'react';

class CardCinema extends Component {
  constructor(props) {
    super(props);
    this.favAddActiveClass= this.favAddActiveClass.bind(this);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      favActive: false,
      favCineActive:false
    }
  }
  favAddActiveClass() {
    this.setState({
      favActive: !this.state.favActive
    })
  }

  favCineActiveClass() {
    this.setState({
      favCineActive: !this.state.favCineActive
    })
  }

  render() {
    return (
      <div className="card-cinema">
        <div className="card-cinema__header">
          <div className="sprite-favCinema"></div>
          <h5 className="card-cinema__header__title">โรงภาพยนต์ที่ชื่นชอบ</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'} onClick={this.favAddActiveClass}></div>
        </div>
        <div className={this.state.favActive? 'card-cinema__body active':'card-cinema__body'}>
            <div className="sprite-quatierCine"></div>
              <div className="card-cinema__CineTitle">
                <div className="card-cinema__CineName">{this.props.item.Name}</div>
                <div className="card-cinema__CineDistant">100 m</div>
              </div>
              <div  className={this.state.favCineActive? 'sprite-favCinema active':'sprite-favCinema'} onClick={this.favCineActiveClass}></div>
        </div>
      </div>
    );
  }
}

export default CardCinema;
