import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import HighlightCarousel from '../components/HighlightShowing'
import Link from 'next/link'


class BottomNavBar extends Component {
  render() {
    return (
      <Tabs>
        <TabPanel>
          <Link prefetch href="/AllMovie">
            <a>ดูภาพยนต์ทั้งหมด</a>
          </Link>
          <HighlightCarousel/>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
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
    );
  }
}

export default BottomNavBar;
