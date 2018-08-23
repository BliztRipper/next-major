import React, { PureComponent, Fragment } from 'react';

class SearchCinema extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  searchItem(){
    let searchClass = this.refs.searchCine.innerText
    console.log(searchClass)
  }

  render() {
    return (
      <section>
        <div className="search-cinema">
          <input onClick={this.searchItem.bind(this)} className="search-cinema__searchbox" placeholder="ค้นหาโรงภาพยนต์ที่ต้องการ" type="text" name="" id=""/>
        </div>
      </section>
    )
  }
}

export default SearchCinema;