import React, { PureComponent } from 'react';
import Link from 'next/link'
import empty from '../static/icon-film-empty.svg'
import RegionCinemaComp from './RegionCinemaComp'
import utilities from '../scripts/utilities';
import '../styles/style.scss'
import { URL_PROD } from '../lib/URL_ENV';

class CinemaSystemList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEmpty:false,
      branches: this.props.branches,
      favorites: [],
      renderSystems:[],
      accid: this.props.accid,
    }
  }

  componentDidMount() {
    this.convertDataToUse()
  }

convertDataToUse() {
  let favorites = this.props.favorites.data.CinemaIds

  //Region
  let renderSystems = []
  this.state.branches.forEach(branch => {
    if (branch.System && branch.System.length) {
      branch.System.forEach(system => {
        if (!(system in renderSystems)) {
          renderSystems[system] = []
        }

        renderSystems[system].push({
          zoneId: branch.DescriptionInside.zone_id,
          zoneName: branch.DescriptionInside.zone_name,
          branchName: utilities.getNameFromBranch(branch),
          branchLocation: {
            latitude: branch.Latitude,
            longitude: branch.Longitude
          },
          cinemaId: branch.ID,
          brandName: utilities.getBrandName(branch.DescriptionInside.brand_name_en),
          isFavorite: utilities.isFavorite(favorites, branch.ID),
          searchKey: branch.Name+branch.NameAlt,
          schedule: null,
        })
      })
    }
  })

  let toSetRenderSystems = Object.keys(renderSystems).map(key => {
      let name = key
      if (!name) {
          name = "Unknown"
      }
      return {
          name: name,
          cinemas: renderSystems[key],
      }
  })

  this.setState({
      renderSystems: toSetRenderSystems,
      isEmpty:(toSetRenderSystems.length == 0),
      favorites: favorites,
  })
}

favActive(cinemaId) {
  let newFav = !utilities.isFavorite(this.state.favorites, cinemaId)
  if(newFav) {
    fetch(`${URL_PROD}/AddFavCinema/${this.state.accid}/${cinemaId}`)
    this.state.favorites.push(cinemaId)
  } else{
    fetch(`${URL_PROD}/RemoveFavCinema/${this.state.accid}/${cinemaId}`)
    this.state.favorites = this.state.favorites.filter(favCinemaId => favCinemaId !== cinemaId)
  }

  let renderSystems = this.state.renderSystems.map(renderSystem => {
    renderSystem.cinemas.forEach(cinema => {
      if (cinemaId == cinema.cinemaId) {
        cinema.isFavorite = newFav
      }
    })
    return renderSystem
  })

  this.setState({
    renderSystems: renderSystems,
    favorites: this.state.favorites
  })
}

renderBySystemType() {
  return this.state.renderSystems.map((renderSystem, i) => {
    return <RegionCinemaComp key={renderSystem.name} region={renderSystem} isExpand={true} iAmFav={false} iAmSystem={true} accid={this.state.accid} favActive={this.favActive.bind(this)} />
  })
}

render() {
  const {isEmpty} = this.state
  if(isEmpty){
    return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/><button className="highlight__book-btn">กดเพื่อกลับหน้าแรก</button></h5></Link></section>
    }

    return this.renderBySystemType()
  }
}

export default CinemaSystemList;
