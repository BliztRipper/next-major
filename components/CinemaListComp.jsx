import React, { PureComponent, Fragment } from 'react';
import Link from 'next/link'
import empty from '../static/icon-film-empty.svg'
import RegionCinemaComp from './RegionCinemaComp'
import utilities from '../scripts/utilities';
import '../styles/style.scss'
import { URL_PROD } from '../lib/URL_ENV';

class CinemaListComp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          isEmpty:false,
          branches: this.props.branches,
          favorites: [],
          regions: [],
          regionsFav: [],
          accid: this.props.accid,
        }
      }

    //this function done after render
    componentDidMount() {
        this.convertDataToUse()
    }

    convertDataToUse() {
        let favorites = this.props.favorites.data.CinemaIds
        if (favorites === null) {
            favorites = []
        }

        //Region
        let regions = []
        this.state.branches.forEach(branch => {
            let key = branch.DescriptionInside.zone_name
            if (!(key in regions)) {
                regions[key] = []
            }

            regions[key].push({
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

        let toSetRegions = Object.keys(regions).map(key => {
            let name = key
            if (!name) {
                name = "Unknown"
            }
            return {
                name: name,
                cinemas: regions[key],
            }
        })

        let regionFav = {
            name: "โรงภาพยนตร์ที่ชื่นชอบ",
            cinemas: [],
        }
        Object.keys(regions).forEach(key => {
            regions[key].forEach(cinema => {
                if (cinema.isFavorite) {
                    regionFav.cinemas.push(cinema)
                }
            })
        })


        this.setState({
            regions: toSetRegions,
            isEmpty:(toSetRegions.length == 0),
            regionsFav:[regionFav],
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

    let regions = this.state.regions.map(region => {
      region.cinemas.forEach(cinema => {
        if (cinemaId == cinema.cinemaId) {
          cinema.isFavorite = newFav
        }
      })
      return region
    })

    let regionsFav = this.state.regionsFav.map(region => {
      region.cinemas.forEach(cinema => {
        if (cinemaId == cinema.cinemaId) {
          cinema.isFavorite = newFav
        }
      })
      return region
    })

    this.setState({
      regions: regions,
      regionsFav: regionsFav,
      favorites: this.state.favorites
    })
  }

    renderFavorite() {
        let favRegions = []
        this.state.regionsFav.forEach((region, i) => {
            if (region.cinemas.length > 0) {
                favRegions.push(<RegionCinemaComp key={region.name + i} region={region} isExpand={(i==0)} iAmFav={true} accid={this.state.accid} pickThisDay={this.state.pickThisDay} favActive={this.favActive.bind(this)}/>)
            }
        })

        if (favRegions.length > 0) {
            return favRegions
        }
    }

    renderRegion() {
        return this.state.regions.map((region, i) => {
            return <RegionCinemaComp key={region.name + i} region={region} isExpand={(i==0)} iAmFav={false} accid={this.state.accid} favActive={this.favActive.bind(this)}/>
        })
    }

    renderRegionTypeList() {
        return (
            <Fragment>
                {this.renderFavorite()}
                {this.renderRegion()}
            </Fragment>
        )
    }

    render() {
        const {isEmpty} = this.state

        if(isEmpty){
            return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/><button className="highlight__book-btn">กดเพื่อกลับหน้าแรก</button></h5></Link></section>
        }

        return this.renderRegionTypeList()
    }
}

export default CinemaListComp;