import React, { Component } from 'react';
import CardCinema from './CardCinema'
import loading from '../static/loading.gif'

class CinemaBranchList extends Component {
  constructor(props) {
    super(props);
    this.favAddActiveClass= this.favAddActiveClass.bind(this);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      favActive: true,
    }
  }

  favAddActiveClass() {
    this.setState({
      favActive: !this.state.favActive
    })
  }

  componentDidMount(){
    try{
      fetch(`https://api-cinema.truemoney.net/Cinemas`)
      .then(response => response.json())
      .then(data => this.setState({dataObj:data.data, isLoading: false}))
    } catch(err){
      error => this.setState({ error, isLoading: false })
    }
  }

  renderCinema(){
    let resultsArray = [];
    this.state.dataObj.map((item, i) => {
      resultsArray.push(<CardCinema item={item} key={i}/>)
    });
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
        <div className="card-cinema__header">
          <div className="sprite-favCinema"></div>
            <h5 className="card-cinema__header__title">โรงภาพยนต์ที่ชื่นชอบ</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'} onClick={this.favAddActiveClass}></div>
        </div>
        <div className={this.state.favActive? 'card-cinema__container active':'card-cinema__container'}>
          {this.renderCinema()}
        </div>
    </div>
    );
  }
}

export default CinemaBranchList;
