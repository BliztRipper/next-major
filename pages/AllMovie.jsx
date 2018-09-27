import React, { PureComponent, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Layout from '../components/Layout'
import '../styles/style.scss'
import NowShowingComp from '../components/NowShowingComp'
import CominSoonComp from '../components/ComingSoonComp'
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
import loading from '../static/loading.svg'
import empty from '../static/emptyTicket.png'

class AllMovie extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      error: null,
      accid: ''
    }

  }
  componentDidMount(){
    fetch(`https://api-cinema.truemoney.net/MovieList`)
    .then(response => response.json())
    .then(data => this.setState({dataObj:data.data, isLoading: false}))
    .catch(error => this.setState({ error, isLoading: false }))
    sessionStorage.setItem('previousRoute', this.props.url.pathname)
    this.setState({
      accid: JSON.parse(sessionStorage.getItem("userInfo")).accid
    })
  }

  render() {
    const {isLoading, error, accid} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src={loading} className="loading"/>
    }

    return (
      <Layout title='All Movie'>
        {(() => {
          if (accid) {
            return (
              <Fragment>
                <h1 className="allmovieTab__header">
                  <GlobalHeaderButtonBack></GlobalHeaderButtonBack>
                  ภาพยนต์ทั้งหมด
                </h1>
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
              </Fragment>
            )
          } else {
            return (
              <section className="empty">
                <img src={empty}/>
                <h5>ข้อมูลไม่ถูกต้อง</h5>
              </section>
            )
          }
        })()}
      </Layout>
    )
  }
}

export default AllMovie;
