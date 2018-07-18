import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import HighlightCarousel from '../components/HighlightShowing'
import ListingCinema from '../components/ListingCinema'
import Link from 'next/link'


class BottomNavBar extends Component {
  render() {
    return (
      <div className="indexTab">
        <Tabs>
        <TabPanel>
          <Link prefetch href="/AllMovie">
            <a className="allmovie-btn">ดูภาพยนต์ทั้งหมด</a>
          </Link>
          <HighlightCarousel/>
        </TabPanel>
        <TabPanel>
          <ListingCinema/>
        </TabPanel>
        <TabPanel>
          <h2>Any content 3</h2>
        </TabPanel>
        <TabList>
          <div className="react-tabs__tabs-container">
            <Tab>ภาพยนต์</Tab>
            <Tab>โรงภาพยนต์</Tab>
            <Tab>ตั๋วหนัง</Tab>
          </div>
        </TabList>
      </Tabs>
      </div>
    );
  }
}

export default BottomNavBar;
