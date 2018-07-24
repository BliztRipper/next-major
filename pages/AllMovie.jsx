import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Layout from '../components/Layout'
import '../styles/style.scss'
import NowShowingComp from '../components/NowShowingComp'
import CominSoonComp from '../components/ComingSoonComp'

class AllMovie extends Component {

  toArr(monthMovie){
    var monthArr = []
    for (var month in monthMovie) {
      var movies = monthMovie[month];
      movies.map((movie,i)=> {
        monthArr[i].push(movie)
      })
    }
    return monthArr
  }

  render() {
    return (
      <Layout title='All Movie'>
      <div className="allmovieTab">
      <Tabs>
        <TabList>
          <Tab>กำลังฉาย</Tab>
          <Tab>เร็วๆนี้</Tab>
        </TabList>
        <TabPanel>
        <NowShowingComp/>
        </TabPanel>
        <TabPanel>
          <CominSoonComp/>
        </TabPanel>
      </Tabs>
      </div>    
      </Layout>
    );
  }
}

export default AllMovie;
