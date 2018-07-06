import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styled from 'styled-components';

class BottomNavBar extends Component {
  render() {
    return (
      <Tabs>
        <TabPanel>
          <h2>Any content 1</h2>
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
