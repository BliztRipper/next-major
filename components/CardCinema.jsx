import React, { PureComponent } from 'react';

class CardCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.favCineActiveClass= this.favCineActiveClass.bind(this);
    this.state = {
      favCineActive:false,
    }
  }
  componentDidMount() {
    if(fetch(`https://api-cinema.truemoney.net/FavCinemas/0891916415`).then(response => response.json()).then(data => data != null)){
        this.setState({favCineActive:true})
      }
  }
  
  favCineActiveClass() {
    let CinemaID = this.props.item.ID
    let phoneNum = '0891916415'
    if(this.state.favCineActive == false) {
      fetch(`https://api-cinema.truemoney.net/AddFavCinema/${phoneNum}/${CinemaID}`)
      .then(this.setState({favCineActive: true}))
    } else{
      fetch(`https://api-cinema.truemoney.net/RemoveFavCinema/${phoneNum}/${CinemaID}`)
      .then(this.setState({favCineActive: false}))
    }
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
