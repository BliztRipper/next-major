import React, { Component } from 'react';
import Layout from '../components/Layout'
import '../styles/style.scss'

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
      <Layout title='All Movie'>
        <section>
          <div className='showing__container'>
                {dataObj.map((item,i) =>
                <div className='showing__cell' key={i}>
                  <img className='showing__poster' src={item.poster_ori}/>
                  <span className='showing__title'>{item.title_th}</span>
                </div>
              )}
          </div>
      </section>
      </Layout>
    );
  }
}

export default AllMovie;
