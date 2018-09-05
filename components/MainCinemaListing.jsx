import React, { PureComponent, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CinemaFavoriteList from './CinemaFavoriteList'
import CinemaSystemList from './CinemaSystemList'
import CinemaRegionalList from './CinemaRegionalList'
import SearchCinema from './SearchCinema'
import loading from '../static/loading.gif'
import CardCinema from './CardCinema'

class MainCinemaListing extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      HideList: false,
      dataFav: [],
      dataCine: [],
      dataSearch: [],
      isLoading: true,
      loadFav: false,
      loadCine: false,
      error: null,
    }
  }

  componentDidMount() {
    try {
      fetch(`https://api-cinema.truemoney.net/FavCinemas/${this.props.accid}`)
        .then(response => response.json())
        .then(data => {
          this.state.dataFav = data
          this.state.loadFav = true
          this.loadComplete()
        })
      fetch(`https://api-cinema.truemoney.net/Branches`)
        .then(response => response.json())
        .then(data => {
          this.state.dataCine = data.data
          this.state.loadCine = true
          this.loadComplete()
        })
    } catch (err) {
      error => this.setState({ error, isLoading: false })
    }
  }

  loadComplete() {
    if (this.state.loadFav && this.state.loadCine) {
      this.setState({isLoading: false})
    }
  }

  onSearchChange(event) {
    if (event.target.value.length) {
      this.getDataSearch(event.target.value.toLowerCase())
      this.setState({ HideList: true })      
    } else {
      this.setState({ HideList: false })
    }
  }

  hasFav(cineId) {    
    let found = false
    if (this.state.dataFav && this.state.dataFav.data.CinemaIds) {
      this.state.dataFav.data.CinemaIds.map(favId=>{
        if(favId === cineId) {
          found = true
          return found
        }
      })
    }

    return found
  }

  getDataSearch(keyword) {
    let cinemas = []
    this.state.dataCine.map(cinema=>{
      if (cinema.Name.toLowerCase().indexOf(keyword) != -1 || 
          cinema.NameAlt.toLowerCase().indexOf(keyword) != -1) {
            cinemas.push(<CardCinema item={cinema} brandname={cinema.DescriptionInside.brandname} key={cinema.ID} accid={this.props.accid} favCineActive={this.hasFav(cinema.ID)} />)
      }
    })

    this.setState({dataSearch: cinemas})
  }

  renderList() {    
    if (!this.state.HideList) {
      return (
        <div className="indexTab__cinema">        
          <Tabs>
            <TabList>
              <Tab>สาขา</Tab>
              <Tab>รูปแบบโรง</Tab>
            </TabList>
            <TabPanel>            
              <CinemaFavoriteList accid={this.props.accid} dataFav={this.state.dataFav} dataCine={this.state.dataCine} />
              <CinemaRegionalList accid={this.props.accid} dataFav={this.state.dataFav} dataCine={this.state.dataCine} />
              </TabPanel>
            <TabPanel>
              <CinemaSystemList accid={this.props.accid} dataFav={this.state.dataFav} dataCine={this.state.dataCine}/>
            </TabPanel>
          </Tabs>
        </div>
      )
    } else {
      return (
        <Fragment>                
          {this.state.dataSearch}
        </Fragment>
      )
    }
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
      <Fragment>
        <div className="searchTab">
          <SearchCinema onSearchChange={this.onSearchChange.bind(this)} />
        </div>
        {this.renderList()}
      </Fragment>
    )
  }
}

export default MainCinemaListing;
