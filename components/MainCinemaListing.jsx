import React, { PureComponent, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CinemaFavoriteList from './CinemaFavoriteList'
import CinemaSystemList from './CinemaSystemList'
import CinemaRegionalList from './CinemaRegionalList'
import SearchCinema from './SearchCinema'
import loading from '../static/loading.gif'

class MainCinemaListing extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      HideList: false,
      dataFav: [],
      dataCine: [],
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
      this.setState({ HideList: true })
    } else {
      this.setState({ HideList: false })
    }
  }

  renderList() {
    if (!this.state.HideList) {
      return (
        <Fragment>
          <CinemaFavoriteList accid={this.props.accid} dataFav={this.state.dataFav} dataCine={this.state.dataCine} />
          <CinemaRegionalList accid={this.props.accid} dataFav={this.state.dataFav} dataCine={this.state.dataCine} />
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
      <div className="indexTab__cinema">
        <Tabs>
          <TabList>
            <Tab>สาขา</Tab>
            <Tab>รูปแบบโรง</Tab>
          </TabList>
          <TabPanel>
            <SearchCinema onSearchChange={this.onSearchChange.bind(this)} />
            {this.renderList()}
          </TabPanel>
          <TabPanel>
            <CinemaSystemList accid={this.props.accid} />
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default MainCinemaListing;
