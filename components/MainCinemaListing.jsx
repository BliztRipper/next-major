import React, { PureComponent } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CinemaFavoriteList from './CinemaFavoriteList'
import CinemaSystemList from './CinemaSystemList'
import CinemaRegionalList from './CinemaRegionalList'
import SearchCinema from './SearchCinema'

class MainCinemaListing extends PureComponent {
  render() {
    return (
      <div className="indexTab__cinema">
        <Tabs>
          <TabList>
              <Tab>สาขา</Tab>
              <Tab>รูปแบบโรง</Tab>
            </TabList>
          <TabPanel>
            {/* <SearchCinema/> */}
            <CinemaFavoriteList/>
            <CinemaRegionalList/>
          </TabPanel>
          <TabPanel>
            <CinemaSystemList/>
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default MainCinemaListing;
