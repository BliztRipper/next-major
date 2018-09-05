import React, { PureComponent, Fragment } from 'react';
import Layout from "../components/Layout";

export default class MovieInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      movieInfo:[]
    }
  }

  componentDidMount(){
    this.setState({movieInfo:JSON.parse(sessionStorage.getItem("movieSelect"))})
  }
  
  render() {
    console.log(this.state.movieInfo);
    return (
      <Layout title="Movie Infomation">
        
      </Layout>
    )
  }
}
