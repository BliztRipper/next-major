import React, { PureComponent } from 'react';
import CardCinema from './CardCinema'

class CinemaFavoriteList extends PureComponent {
  constructor(props) {
    super(props);
    this.favAddActiveClass= this.favAddActiveClass.bind(this);
    this.state = {
      dataFav: this.props.dataFav,
      dataCine: this.props.dataCine,
      favActive: false,
    }
  }

  favAddActiveClass() {
    this.setState({
      favActive: !this.state.favActive
    })
  }

  renderFav(){    
    let resultsArray = []
    if(this.state.dataFav && this.state.dataCine){
      this.state.dataCine.map(item=>{
        if(this.state.dataFav.data.CinemaIds != null) {
          this.state.dataFav.data.CinemaIds.map(cineID=>{
            if(cineID === item.ID){
              let brand = item.DescriptionInside.brand_name_en
              let brandname = brand.replace(/ +/g, "")
              resultsArray.push(<CardCinema item={item} brandname={brandname} key={item.ID} accid={this.props.accid}/>)
            }
          })
        }
      })
    }
    return resultsArray;
  }

  render() {
    if (!this.state.dataFav.data.CinemaIds) {
      return false
    }
    
    return (
      <div className="card-cinema">
        <div className="card-cinema__header" onClick={this.favAddActiveClass}> 
          <div className="sprite-favCinema active"></div>
            <h5 className="card-cinema__header__title">โรงภาพยนต์ที่ชื่นชอบ</h5>
          <div className={this.state.favActive? 'sprite-chevronDown active':'sprite-chevronDown'}></div>
        </div>
        <div className={this.state.favActive? 'card-cinema__container active':'card-cinema__container'}>
          {this.renderFav()}
        </div>
    </div>
    );
  }
}

export default CinemaFavoriteList;
