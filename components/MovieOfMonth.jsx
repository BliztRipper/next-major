import React, { Component } from 'react';

class MovieOfMonth extends Component {
  render() {
    return (
      <div className="comingsoon__head-container">
        <h4 className="comingsoon__header">{this.props.title}</h4>
      </div>
    );
  }
}

export default MovieOfMonth;
