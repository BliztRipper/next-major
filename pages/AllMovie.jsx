import React, { PureComponent, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Layout from '../components/Layout'
import Link from 'next/link'
import '../styles/style.scss'
import NowShowingComp from '../components/NowShowingComp'
import CominSoonComp from '../components/ComingSoonComp'
import GlobalHeaderButtonBack from '../components/GlobalHeaderButtonBack'
import loading from '../static/loading.svg'
import empty from '../static/emptyMovie.png'
import GlobalFooterNav from '../components/GlobalFooterNav'

class AllMovie extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataObj: [],
      isLoading: true,
      isEmpty: false,
      isError: false,
      error: null,
      accid: ''
    }

  }
  componentDidMount(){

    let instantAllMovies = JSON.parse(sessionStorage.getItem('allMovies'))
    let hasMovies = instantAllMovies.now_showing.length > 0 || instantAllMovies.advance_ticket.length > 0 || instantAllMovies.comingsoon.length > 0
    sessionStorage.setItem('previousRoute', this.props.url.pathname)
    this.setState({
      dataObj: hasMovies ? instantAllMovies : [],
      isLoading: hasMovies ? false : true,
      isEmpty: hasMovies ? false : true,
      accid: JSON.parse(sessionStorage.getItem("userInfo")).accid
    })
  }

  render() {
    const {isLoading, isError, isEmpty, accid, dataObj} = this.state;

    if (isError) {
      return (
        <section className="empty">
          <img src={empty}/>
          <h5>ข้อมูลไม่ถูกต้อง</h5>
        </section>
      )
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
                        let hasMovies = dataObj.now_showing.length > 0 || dataObj.advance_ticket.length > 0
                        if (hasMovies)  {
                          return <NowShowingComp dataObj={dataObj}  accid={this.state.accid}/>
                        } else {
                          return <section className="empty"><img src={empty}/><Link prefetch href='/'><h5>ขออภัย ไม่มีภาพยนตร์เข้าฉายในช่วงเวลานี้<br/><br/><button className="highlight__book-btn">กดเพื่อกลับหน้าแรก</button></h5></Link></section>
                        }
                      })()}
                    </TabPanel>
                    <TabPanel>
                      {(() => {
                        let hasMovies = dataObj.comingsoon.length > 0
                        if (hasMovies) {
                          return <CominSoonComp dataObj={dataObj} />
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
