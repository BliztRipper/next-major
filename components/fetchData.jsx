import React, { Component } from 'react';

class fetchData extends Component {
  static async getInitialProps() {
    const req = await fetch(`https://api.hackerwebapp.com/news`)
    const stories = await req.json()
    return {stories}
  }
  
  render() {
    return(
      <div>
        {this.props.stories}
      </div>
    )
   }
 }

 export default fetchData