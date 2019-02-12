import React, { Component, Fragment } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link'
import Router from 'next/router'
import RegionCinemaComp from '../components/RegionCinemaComp'
import MovieInfoComp from '../components/MovieInfoComp'
import SearchCinema from '../components/SearchCinema'
import DateFilters from '../components/DateFilters'
import utilities from '../scripts/utilities';
import '../styles/style.scss'
import GlobalFooterNav from '../components/GlobalFooterNav'
import { StickyContainer, Sticky } from 'react-sticky';
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
import { URL_PROD } from '../lib/URL_ENV';

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
      accid: '',
      movieInfo: '',
      HideList: false,
      searchRegions: [],
      isSelectCinema:true,
      selectBy:'cinema'
    }
  }

  componentDidMount() {
    this.state.movieInfo = JSON.parse(sessionStorage.getItem('movieSelect'))
    let instantUserInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (!this.state.movieInfo || !instantUserInfo) {
      Router.push({ pathname: '/' })
    } else {
      this.setState({
        movieInfo: this.state.movieInfo,
        accid: instantUserInfo.accid
      })
      let dataToPostSchedule = {
        cinemaId: '',
        filmIds: this.state.movieInfo.movieCode
      }
      try {
        sessionStorage.setItem('CinemaID','')
        sessionStorage.setItem('BookingCinema','')

        this.setState({nowShowing:JSON.parse(sessionStorage.getItem("movieSelect"))})
        fetch(`${URL_PROD}/Schedule`,{
          method: 'POST',
          body: JSON.stringify(dataToPostSchedule)
        })
        .then(response => response.json())
        .then(data =>  {
          this.state.schedules = data.data
          this.state.serverTime = data.server_time

          fetch(`${URL_PROD}/FavCinemas/${this.state.accid}`)
          .then(response => response.json())
          .then(data => {
            if (data.data.CinemaIds) {
              this.state.favorites = data.data.CinemaIds
              if (this.state.favorites === null) {
                this.state.favorites = []
              }
            }
            this.state.loadFavorites = true
            this.loadComplete()
          })

          fetch(`${URL_PROD}/Branches`)
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
        branchLocation: {
          latitude: branch.Latitude,
          longitude: branch.Longitude
        },
        cinemaId: branch.ID,
        brandId: branch.DescriptionInside.brand_id,
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
    this.state.schedules.forEach(cinemaBranch => {
      cinemaBranch.Theaters.forEach(theater => {
        theater.MovieInTheaters.forEach(movie => {
          let strDate = movie.Showtimes.substring(0, 10)
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
    this.setState({
      dates: this.state.dates,
      isEmpty:(this.state.dates.length == 0)
    })
    this.pickThisDay(0)
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
        keywordSearch: keyword,
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

  renderFavorite(cinemaIds) {
    let favRegions = []
    this.state.regionsFav.forEach((region, i) => {
      let findCinema = false
      if (region.cinemas.length > 0 && cinemaIds.length > 0) {
        cinemaIds.forEach(cinemaId => {
          region.cinemas.forEach(cinemaFav => {
            if (cinemaId === cinemaFav.cinemaId) {
              findCinema = true
            }
          })
        });
        if (findCinema) {
          favRegions.push(<RegionCinemaComp key={region.name + i} region={region} isExpand={(i==0)} iAmFav={true} accid={this.state.accid} pickThisDay={this.state.pickThisDay} favActive={this.favActive.bind(this)}/>)
        }
      }
    })

    if (favRegions.length > 0) {
      return favRegions
    }
  }

  renderRegion() {
    let instantRegions = []
    let instantCinemaIds = []
    if (this.state.regions && this.state.regions.length > 0) {
      instantRegions = this.state.regions.map((region, i) => {
        let instantShowtimesFilterByDate = []
        region.allowRender = false

        if (region.cinemas && region.cinemas.length > 0) {
          region.cinemas.map((cinema) => {
            cinema.allowRender = false
            let instantTheatres = cinema.schedule.Theaters
            if (instantTheatres && instantTheatres.length > 0) {
              instantTheatres.forEach(theater => {

                instantShowtimesFilterByDate = utilities.getShowtime(theater.MovieInTheaters, this.state.pickThisDay)
                theater.allowRender = false

                if (instantShowtimesFilterByDate.length > 0) {
                  theater.showtimesFilterByDate = instantShowtimesFilterByDate
                  theater.allowRender = true
                  cinema.allowRender = true
                  region.allowRender = true
                }

              })
            }
            if (cinema.allowRender) {
              instantCinemaIds.push(cinema.cinemaId)
            }
          })
        }

        if (region.allowRender) {
          return (<RegionCinemaComp key={region.name + i} region={region} isExpand={(i==0)} iAmFav={false} accid={this.state.accid} pickThisDay={this.state.pickThisDay} serverTime={this.state.serverTime} favActive={this.favActive.bind(this)}/>)
        } else {
          return false
        }
      })
      instantRegions.unshift(this.renderFavorite(instantCinemaIds))
      return (
        <div className="cinema__cardItems">
          {instantRegions}
        </div>
      )
    }
  }

  renderSearchData() {
    return this.state.searchRegions.map((region, i) => {
      return <RegionCinemaComp key={region.name + i + region.keywordSearch} region={region} isExpand={(i==0)} iAmFav={false} accid={this.state.accid} pickThisDay={this.state.pickThisDay} serverTime={this.state.serverTime} favActive={this.favActive.bind(this)}/>
    })
  }

  renderRegionTypeList() {
    if (this.state.HideList) {
      return this.renderSearchData()
    } else {
      return (
        <Fragment>
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
      return <img src="../Home/static/loading.svg" className="loading"/>
    }
    if(isEmpty){
      return <section className="empty"><img src="../Home/static/icon-film-empty.svg"/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/><button className="highlight__book-btn">กดเพื่อกลับหน้าแรก</button></h5></Link></section>
    }
    const hideNoTransition = {
      opacity:0,
      visibility:'hidden',
      position: 'absolute',
    }
    const titleHide = {
      opacity:0,
      visibility:'hidden',
      position: 'absolute',
      transition:'all 0.2s',
    }
    const titleShow = {
      position: 'relative',
      transition:'all 0.2s',
      opacity:1,
      visibility:'visible',
      textAlign:'center',
      backgroundColor:'#fff',
      paddingTop:'1rem',
      margin:0,
      zIndex:99,
    }
    const stickyWrapper = {
      position:'relative',
      transition:'all 0.2s',
      backgroundColor: '#fff',
      color:'#000',
      left: '-8px',
      maxWidth: '105%',
      width: '105%',
      zIndex:10,
    }
    const hideStickyWrapper = {
      backgroundColor: 'transparent',
      transition:'all 0.2s',
    }
    const stickyBar = {
      position: 'relative',
      zIndex: 5,
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
          <div className="ogno" style={stickyBar}>
            <Sticky topOffset={-100} disableCompensation={false}>
              {({style,isSticky}) => (
                <div style={style}>
                  <div style={isSticky ? stickyWrapper:hideStickyWrapper}>
                    <h2 style={isSticky ? titleShow:hideNoTransition}><div style={{ position: 'relative', paddingLeft:'12vw', paddingRight:'12vw' }}><GlobalHeaderButtonBack></GlobalHeaderButtonBack> {this.state.nowShowing.title_en}</div></h2>
                    <h3 style={isSticky ? titleShow:hideNoTransition}>{this.state.nowShowing.title_th}</h3>
                    <DateFilters stickyItem={isSticky ? true:false} serverTime={serverTime} dates={dates} sliderBeforeChange={this.dateFilterSliderBeforeChange.bind(this)} additionalClass="isSelectCinemaByMovie"></DateFilters>
                    <SearchCinema isSelectCinema={this.state.isSelectCinema} stickyItem={isSticky ? true:false} onSearchChange={this.onSearchChange.bind(this)} />
                  </div>
                </div>
              )}
            </Sticky>
          </div>
          {this.renderRegionTypeList()}
        </StickyContainer>
        <GlobalFooterNav selectBy={this.state.selectBy}/>
      </Layout>
    )
  }
}

export default MainSelectCinemaByMovie;

