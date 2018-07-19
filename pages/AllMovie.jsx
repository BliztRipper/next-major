import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Layout from '../components/Layout'
import '../styles/style.scss'
import AllMoviePLaceholder from './AllMoviePlaceHolder'

class AllMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
    }
  }
  componentDidMount(){
    fetch(`http://54.169.203.113/MovieList`)
    .then(response => response.json())
    .then(data => this.setState({dataObj:data.data, isLoading: false}))
    .catch(error => this.setState({ error, isLoading: false }))
  }
  render() {
    const {dataObj, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <AllMoviePLaceholder/>
    }
    return (
      <Layout title='All Movie'>
      <div className="allmovieTab">
      <Tabs>
        <TabList>
          <Tab>กำลังฉาย</Tab>
          <Tab>เร็วๆนี้</Tab>
        </TabList>
        <TabPanel>
        <section>
          <div className='showing__container'>
                {dataObj.now_showing.map((item,i) =>
                <div className='showing__cell' key={i}>
                  <img className='showing__poster' src={item.poster_ori}/>
                  <span className='showing__title'>{item.title_th}</span>
                </div>
              )}
          </div>
        </section>
        </TabPanel>
        <TabPanel>
          <section>
            <div className='comingsoon__container'>
                  {dataObj.comingsoon.map((item,i) =>
                  <div className='comingsoon__cell' key={i}>
                    <img className='comingsoon__poster' src={item.poster_ori}/>
                    <span className='comingsoon__title'>{item.title_th}</span>
                  </div>
                )}
            </div>
          </section>
        </TabPanel>
      </Tabs>
      </div>    
      </Layout>
      
    );
  }
}

export default AllMovie;
