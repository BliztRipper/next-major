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
      monthMovie:[],
      monthArr:[],
    }
  }
  componentDidMount(){
    fetch(`http://54.169.203.113/MovieList`)
    .then(response => response.json())
    .then(data => this.setState({dataObj:data.data, isLoading: false}))
    .catch(error => this.setState({ error, isLoading: false }))
  }

  convertToYearMonth(dateString) {
    if (dateString.length >= 7){
      switch (dateString.substring(0,7)) {
        case '2018-07':
        dateString = 'jul2018'
          break;
        case '2018-08':
        dateString = 'aug2018'
          break;
        case '2018-09':
        dateString = 'sep2018'
          break;
        case '2018-10':
        dateString = 'oct2018'
          break;
        case '2018-11':
        dateString = 'nov2018'
          break;
        case '2018-12':
        dateString = 'dec2018'
          break;
        case '2019-01':
        dateString = 'jan2019'
          break;
        case '2019-02':
        dateString = 'feb2019'
          break;
        case '2019-03':
        dateString = 'mar2019'
          break;
    
      }
    }
    return dateString
  }

  toArr(){
    for (var month in monthMovie) {
      var movies = monthMovie[month];
      movies.map((movie,i)=> {
        monthArr[i].push(movie)
      })
    }
  }

  render() {
    const {dataObj, isLoading, error, monthMovie} = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <AllMoviePLaceholder/>
    }


    dataObj.comingsoon.forEach(movie => {
      let key = this.convertToYearMonth(movie.release_date)
      if (key in monthMovie == false){
        monthMovie[key] = []
      } 
      monthMovie[key].push({title: movie.title_th, poster:movie.poster_ori,})
    })

      //console.log(monthMovie);
     

    
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
