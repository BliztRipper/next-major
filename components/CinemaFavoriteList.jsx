import React, { PureComponent } from 'react';
import CardCinema from './CardCinema'
import loading from '../static/loading.gif'

class CinemaFavoriteList extends PureComponent {
  constructor(props) {
    super(props);
    this.favAddActiveClass= this.favAddActiveClass.bind(this);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      favActive: false,
    }
  }

  favAddActiveClass() {
    this.setState({
      favActive: !this.state.favActive
    })
  }

  componentDidMount(){
    try{
      fetch(`https://api-cinema.truemoney.net/FavCinemas/0891916415`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data, isLoading: false}))
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }

  renderCinema(){
    let resultsArray = []
    if (this.state.dataObj.data.CinemaIds){
      this.state.dataObj.data.CinemaIds.map(item => {
        resultsArray.push(<CardCinema item={item} key={item.id}/>)
      })
    }
    return resultsArray;
  }
  render() {
    const {isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) { 
      return <img src={loading} className="loading"/>
    }
    
    return (
      <div className="card-cinema">
        <div className="card-cinema__header" onClick={this.favAddActiveClass}> 
          <div className="sprite-favCinema"></div>
            <h5 className="card-cinema__header__title">โรงภาพยนต์ที่ชื่นชอบ</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'}></div>
        </div>
        <div className={this.state.favActive? 'card-cinema__container active':'card-cinema__container'}>
          {this.renderCinema()}
        </div>
    </div>
    );
  }
}

export default CinemaFavoriteList;
