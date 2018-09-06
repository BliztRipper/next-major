import React, { PureComponent } from 'react';
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs';
import HighlightCarousel from '../components/HighlightCarousel'
import MainCinemaListing from '../components/MainCinemaListing'
import MyTicket from '../components/MyTicket'
import Link from 'next/link'


class MainNavBar extends PureComponent {
  constructor(props) {
    super(props);
    this.currentTabsIndex = 0
    this.bounceOnScrollStyles = {
      disable: 'position: fixed; top: 0; left: 0; margin: 0; padding: 8px; width: 100vw; height: 100vh; overflow-x: hidden; overflow-y: scroll; -webkit-overflow-scrolling: touch;',
      enable: 'position: ; top: ; left: ; margin: ; padding: ; width: ; height: ; overflow-x: ; overflow-y: ; -webkit-overflow-scrolling: ;'
    }
  }
  setStyleBounceOnScroll (styles) {
    let documents = [document.documentElement, document.body]
    documents.forEach(element => element.style.cssText = styles);
  }

  onSelectTabs (index) {
    this.currentTabsIndex = index
    if (this.currentTabsIndex !== 0) {
      this.setStyleBounceOnScroll(this.bounceOnScrollStyles.enable)
    } else {
      this.setStyleBounceOnScroll(this.bounceOnScrollStyles.disable)
    }
  }
  componentDidMount () {
    if (this.currentTabsIndex === 0) {
      this.setStyleBounceOnScroll(this.bounceOnScrollStyles.disable)
    }
  }
  render() {
    resetIdCounter()
    let dataToAllMovies = {
      pathname: '/AllMovie',
      query: {
        accid: this.props.accid
      }
    }
    return (
      <div className="indexTab">
        <Tabs onSelect={this.onSelectTabs.bind(this)} defaultIndex={this.currentTabsIndex}>
          <TabPanel>
            <Link prefetch href={dataToAllMovies}>
              <a className="allmovie-btn">ดูภาพยนต์ทั้งหมด</a>
            </Link>
            <HighlightCarousel accid={this.props.accid}/>
          </TabPanel>
          <TabPanel>
            <MainCinemaListing accid={this.props.accid}/>
          </TabPanel>
          <TabPanel>
            <MyTicket accid={this.props.accid}></MyTicket>
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
