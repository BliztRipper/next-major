import React, { PureComponent, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Layout from '../components/Layout'
import Link from 'next/link'
import '../styles/style.scss'
import NowShowingComp from '../components/NowShowingComp'
import CominSoonComp from '../components/ComingSoonComp'
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
import loading from '../static/loading.svg'
import empty from '../static/emptyTicket.png'
import GlobalFooterNav from '../components/GlobalFooterNav'
import axios from 'axios'

class AllMovie extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      isEmpty: false,
      error: null,
      accid: ''
    }

  }
  componentDidMount(){
    axios(`https://api-cinema.truemoney.net/MovieList`)
    .then(response => {
      let hasMovies = response.data.data.now_showing.length > 0 && response.data.data.advance_ticket.length > 0 && response.data.data.comingsoon.length > 0
      this.setState({
        dataObj: response.data.data,
        isLoading: false,
        isEmpty: hasMovies
      })
    })
    .catch(error => this.setState({ error, isLoading: false }))
    sessionStorage.setItem('previousRoute', this.props.url.pathname)
    this.setState({
      accid: JSON.parse(sessionStorage.getItem("userInfo")).accid
    })
  }

  render() {
    const {isLoading, isEmpty, error, accid, dataObj} = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return (
        <div>
          <GlobalFooterNav/>
          <img src={loading} className="loading"/>
        </div>
      )
    }

    if (isEmpty) {
      return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/><button className="highlight__book-btn">กดเพื่อกลับหน้าแรก</button></h5></Link></section>
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
                      {(() => {
                        let hasMovies = this.state.dataObj.now_showing.length > 0 || this.state.dataObj.advance_ticket.length > 0
                        if (hasMovies)  {
                          return <NowShowingComp dataObj={this.state.dataObj}  accid={this.state.accid}/>
                        } else {
                          return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/><button className="highlight__book-btn">กดเพื่อกลับหน้าแรก</button></h5></Link></section>
                        }
                      })()}
                    </TabPanel>
                    <TabPanel>
                      {(() => {
                        let hasMovies = this.state.dataObj.comingsoon.length > 0
                        if (hasMovies) {
                          return <CominSoonComp dataObj={this.state.dataObj} />
                        } else {
                          return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/><button className="highlight__book-btn">กดเพื่อกลับหน้าแรก</button></h5></Link></section>
                        }
                      })()}
                    </TabPanel>
                  </Tabs>
                </div>
                <GlobalFooterNav/>
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
