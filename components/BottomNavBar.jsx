import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class BottomNavBar extends Component {
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
    .then(data => this.setState({dataObj:data.data.comingsoon, isLoading: false}))
    .catch(error => this.setState({ error, isLoading: false }))
  }
  render() {
    const {dataObj, isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <p>Loading...</p>;
    }
    {console.log(dataObj)}
    return (
      <Tabs>
        <TabPanel>
          <div className='showing__container'>
              {dataObj.map((item,i) =>
              <div className='showing__cell' key={i}>
                <img className='showing__poster' src={item.poster_ori}/>
                <span className='showing__title'>{item.title_th}</span>
              </div>
            )}
          </div>
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
