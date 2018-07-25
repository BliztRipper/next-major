import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CinemaBranchList from './CinemaBranchList'
import CinemaSystemList from './CinemaSystemList'
import CinemaRegionalList from './CinemaRegionalList'

class ListingCinema extends Component {
  render() {
    return (
      <div className="indexTab__cinema">
        <Tabs>
          <TabList>
              <Tab>สาขา</Tab>
              <Tab>รูปแบบโรง</Tab>
            </TabList>
          <TabPanel>
            <CinemaBranchList/>
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

export default ListingCinema;
