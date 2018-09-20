import React, { Component, Fragment } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link'
import loading from '../static/loading.svg'
import empty from '../static/emptyMovie.png'
import RegionCinemaComp from '../components/RegionCinemaComp'
import MovieInfoComp from '../components/MovieInfoComp'
import SearchCinema from '../components/SearchCinema'
import DateFilters from '../components/DateFilters'
import utilities from '../scripts/utilities';
import '../styles/style.scss'
import { StickyContainer, Sticky } from 'react-sticky';
import { log } from 'util';

class MainSelectCinemaByMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      loadFavorites: false,
      loadBranches: false,
      error: null,
      serverTime:'',
      isEmpty:false,
      branches: [],
      favorites: [],
      schedules: [],
      regions: [],
      regionsFav: [],
      dates: [],
      pickThisDay: 0,
      accid: this.props.url.query.accid,
      movieInfo: '',
      HideList: false,
      searchRegions: [],
    }
  }

  //this function done after render
  componentDidMount() {
    this.state.movieInfo = JSON.parse(sessionStorage.getItem('movieSelect'))
    this.setState({ movieInfo: this.state.movieInfo })
    let dataToPostSchedule = {
      cinemaId: '',
      filmIds: this.state.movieInfo.movieCode
    }
    try {
      sessionStorage.setItem('CinemaID','')
      sessionStorage.setItem('BookingCinema','')

      this.setState({nowShowing:JSON.parse(sessionStorage.getItem("movieSelect"))})
      fetch(`https://api-cinema.truemoney.net/Schedule`,{
        method: 'POST',
        body: JSON.stringify(dataToPostSchedule)
      })
      .then(response => response.json())
      .then(data =>  {
        this.state.schedules = data.data
        this.state.serverTime = data.server_time

        fetch(`https://api-cinema.truemoney.net/FavCinemas/${this.state.accid}`)
        .then(response => response.json())
        .then(data => {
          if (data.data.CinemaIds) {
            this.state.favorites = data.data.CinemaIds
          }
          this.state.loadFavorites = true
          this.loadComplete()
        })

        fetch(`https://api-cinema.truemoney.net/Branches`)
        .then(response => response.json())
        .then(data=> {
          this.state.branches = data.data
          this.state.loadBranches = true
          this.loadComplete()
        })
      })
    } catch (error) {
      error => this.setState({ error, isLoading: false })
    }
  }

  loadComplete() {
    if (this.state.loadFavorites && this.state.loadBranches) {
      this.convertDataToUse()
      this.fillterDate()
      this.setState({isLoading: false})
    }
  }

  getRegionsBySchedule(regions, schdule) {
    let result = null
    let name = ""
    Object.keys(regions).forEach(key => {
      regions[key].forEach(region => {
        if (region.cinemaId == schdule.CinemaId) {
          name = key
          result = region
          result.schedule = schdule
          return
        }
      })
    })

    if (!name) {
      name = "Unknown"
    }
    return {cinema:result, regionName:name}
  }

  convertDataToUse() {
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
        cinemaId: branch.ID,
        brandName: utilities.getBrandName(branch.DescriptionInside.brand_name_en),
        isFavorite: utilities.isFavorite(this.state.favorites, branch.ID),
        searchKey: branch.Name+branch.NameAlt,
        schedule: null,
      })
    })

    let mapRegions = []
    this.state.schedules.forEach(schedule => {
      let region = this.getRegionsBySchedule(regions, schedule)
      if (!(region.regionName in mapRegions)) {
        mapRegions[region.regionName] = {
          name: region.regionName,
          cinemas: [region.cinema],
        }
      } else {
        mapRegions[region.regionName].cinemas.push(region.cinema)
      }
    })

    let toSetRegions = Object.keys(mapRegions).map(key => {
      return mapRegions[key]
    })

    let regionFav = {
      name: "โรงภาพยนตร์ที่ชื่นชอบ",
      cinemas: [],
    }
    Object.keys(regions).forEach(key => {
        regions[key].forEach(cinema => {
            if (cinema.isFavorite && cinema.schedule) {
                regionFav.cinemas.push(cinema)
            }
        })
    })

    this.setState({
      regions: toSetRegions,
      isEmpty:(toSetRegions.length == 0),
      regionsFav:[regionFav],
    })
  }

  fillterDate() {
    let mapDates = []
    this.state.schedules.forEach(schedule => {
      schedule.Theaters.forEach(theater => {
        theater.Showtimes.forEach(showtime => {
          let strDate = showtime.substring(0, 10)
          if (!(strDate in mapDates)) {
            mapDates[strDate] = true
            this.state.dates.push(strDate)
          }
        })
      })
    })

    const stringSorter = function(a, b) {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    }

    this.state.dates.sort(stringSorter)
    this.setState({dates: this.state.dates})
    this.setState({isEmpty:(this.state.dates.length == 0)})
    this.pickThisDay(0)
  }

  favActive(cinemaId) {
    let newFav = !utilities.isFavorite(this.state.favorites, cinemaId)
    if(newFav) {
      fetch(`https://api-cinema.truemoney.net/AddFavCinema/${this.state.accid}/${cinemaId}`)
      this.state.favorites.push(cinemaId)
    } else{
      fetch(`https://api-cinema.truemoney.net/RemoveFavCinema/${this.state.accid}/${cinemaId}`)
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

  pickThisDay(index){
    setTimeout(() => {
      this.setState({
        pickThisDay:this.state.dates[index]
      })
    }, 50);
  }

  dateFilterSliderBeforeChange (index) {
    this.pickThisDay(index)
  }

  onSearchChange(event) {
    if (event.target.value.length) {
      this.getDataSearch(event.target.value.toLowerCase())
      this.setState({ HideList: true })
    } else {
      this.setState({ HideList: false })
    }
  }

  getDataSearch(keyword) {
    let regions = []
    this.state.regions.forEach(region=>{
      let searchRegion = {
        name: region.name,
        cinemas: [],
      }

      region.cinemas.forEach(cinema => {
        if (cinema.searchKey.toLowerCase().indexOf(keyword) != -1) {
          searchRegion.cinemas.push(cinema)
        }
      })

      if (searchRegion.cinemas.length) {
        regions.push(searchRegion)
      }
    })

    this.setState({searchRegions: regions})
  }

  renderFavorite() {
    return this.state.regionsFav.map((region, i) => {
        return <RegionCinemaComp region={region} isExpand={(i==0)} iAmFav={true} accid={this.state.accid} pickThisDay={this.state.pickThisDay} favActive={this.favActive.bind(this)}/>
    })
  }

  renderRegion() {
    return this.state.regions.map((region, i) => {
      return <RegionCinemaComp region={region} isExpand={(i==0)} iAmFav={false} accid={this.state.accid} pickThisDay={this.state.pickThisDay} favActive={this.favActive.bind(this)}/>
    })
  }

  renderSearchData() {
    return this.state.searchRegions.map((region, i) => {
      return <RegionCinemaComp region={region} isExpand={(i==0)} iAmFav={false} accid={this.state.accid} pickThisDay={this.state.pickThisDay} favActive={this.favActive.bind(this)}/>
    })
  }

  renderRegionTypeList() {
    if (this.state.HideList) {
      return (
        this.renderSearchData()
      )
    } else {
      return (
        <Fragment>
          {this.renderFavorite()}
          {this.renderRegion()}
        </Fragment>
      )
    }
  }

  render() {
    const {isLoading, error, isEmpty, movieInfo, serverTime, dates} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/>กดเพื่อกลับหน้าแรก</h5></Link></section>
    }
    const titleHide = {
      opacity:0,
      visibility:'hidden',
      position: 'absolute',
    }
    const titleShow = {
      transition:'0.4s',
      opacity:1,
      visibility:'visible',
      textAlign:'center',
      backgroundColor:'#fff',
      padding:'1rem 0',
      margin:0,
      position:'relative',
      zIndex:99,
    }
    const stickyWrapper = {
      position:'relative',
      backgroundColor: '#fff',
      color:'#000',
      left: '-8px',
      maxWidth: '105%',
      width: '105%',
    }
    const hideStickyWrapper = {
      backgroundColor: 'transparent',
    }
    const fixWidth = {

    }
    sessionStorage.setItem('BookingMovie',this.state.nowShowing.title_en)
    sessionStorage.setItem('BookingMovieTH',this.state.nowShowing.title_th)
    sessionStorage.setItem('BookingGenre',this.state.nowShowing.genre)
    sessionStorage.setItem('BookingDuration',this.state.nowShowing.duration)
    sessionStorage.setItem('BookingPoster',this.state.nowShowing.poster_ori)
    return (
      <Layout title="Select Movie">
        <MovieInfoComp item={movieInfo} />
        <StickyContainer>
          <Sticky topOffset={-100} disableCompensation={false}>
            {({style,isSticky}) => (
              <div style={style}>
                <div className="wrapperSticky" style={isSticky ? stickyWrapper:hideStickyWrapper}>
                  <h2 style={isSticky ? titleShow:titleHide}>{this.state.nowShowing.title_en}</h2>
                  <DateFilters stickyItem={isSticky ? true:false} serverTime={serverTime} dates={dates} sliderBeforeChange={this.dateFilterSliderBeforeChange.bind(this)} additionalClass="isSelectCinemaByMovie"></DateFilters>
                  <SearchCinema stickyItem={isSticky ? true:false} onSearchChange={this.onSearchChange.bind(this)} />
                </div>
              </div>
            )}
          </Sticky>
          {this.renderRegionTypeList()}
        </StickyContainer>
      </Layout>
    )
  }
}

export default MainSelectCinemaByMovie;

