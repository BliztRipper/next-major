import React, { PureComponent } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import HighlightCarousel from '../components/HighlightCarousel'
import MainCinemaListing from '../components/MainCinemaListing'
import Link from 'next/link'


class MainNavBar extends PureComponent {
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
          <MainCinemaListing/>
        </TabPanel>
        <TabPanel>
          <h2>Any content 3</h2>
        </TabPanel>
        <TabList>
          <div className="react-tabs__tabs-container">
            <Tab>
              <div className="sprite-tab-menu1"></div>
              <span className="tab-menu-title">ภาพยนต์</span>
            </Tab>
            <Tab>
              <div className="sprite-tab-menu2"></div>
              <span className="tab-menu-title">โรงภาพยนต์</span>
            </Tab>
            <Tab>
            <div className="sprite-tab-menu3"></div>
            <span className="tab-menu-title">ตั๋วหนัง</span>
            </Tab>
          </div>
        </TabList>
      </Tabs>
      </div>
    );
  }
}

export default MainNavBar;
