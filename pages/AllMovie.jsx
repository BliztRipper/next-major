import React, { PureComponent } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Layout from '../components/Layout'
import '../styles/style.scss'
import NowShowingComp from '../components/NowShowingComp'
import CominSoonComp from '../components/ComingSoonComp'
import loading from '../static/loading.gif'

class AllMovie extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      accid: this.props.url.query.accid
    }
    
  } 
  componentDidMount(){
    fetch(`https://api-cinema.truemoney.net/MovieList`)
    .then(response => response.json())
    .then(data => this.setState({dataObj:data.data, isLoading: false}))
    .catch(error => this.setState({ error, isLoading: false }))
  }

  render() {
    const {isLoading, error} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }

    return (
      <Layout title='All Movie'>
      <h1 className="allmovieTab__header">ภาพยนต์ทั้งหมด</h1>
      <div className="allmovieTab">
      <Tabs> 
        <TabList>
          <Tab>กำลังฉาย</Tab>  
          <Tab>เร็วๆนี้</Tab>
        </TabList>
        <TabPanel>
          <NowShowingComp dataObj={this.state.dataObj}  accid={this.state.accid}/>
        </TabPanel>
        <TabPanel> 
          <CominSoonComp dataObj={this.state.dataObj} />
        </TabPanel>
      </Tabs>
      </div>    
      </Layout>
    )
  }
}

export default AllMovie;
