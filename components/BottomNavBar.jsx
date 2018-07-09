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
    fetch(`https://api.hackerwebapp.com/news`)
    .then(response => response.json())
    .then(data => this.setState({dataObj:data, isLoading: false}))
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
          <h2>Any content 1</h2>
          {dataObj.map((item,i) =>
          <div key={i}>
            <h1> {item.title}</h1>
            <h4> {item.points}</h4>
          </div>
        )}
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
