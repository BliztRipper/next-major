import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import HighlightCarousel from '../components/HighlightShowing'
import ListingCinema from '../components/ListingCinema'
import Link from 'next/link'


class BottomNavBar extends Component {
  render() {
    return (
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
        <style>{`
          .allmovie-btn{
            text-align:center;
            display:block;
            padding:10px;
            text-decoration:none;
            border: 1px solid #bbb;
            border-radius: 8px;
            color:#737373;
          }
        `}</style>
      </Tabs>

    );
  }
}

export default BottomNavBar;
